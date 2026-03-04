using System.Net.Mail;
using System.Security.Claims;
using backend.Application.Tenancy;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.Auth;

public sealed class AuthApplicationService(
    ApplicationDbContext dbContext,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService,
    ITenantContextAccessor tenantContextAccessor) : IAuthApplicationService
{
    private static readonly HashSet<string> AllowedSexValues = new(StringComparer.OrdinalIgnoreCase)
    {
        "male",
        "female",
        "other",
        "unknown"
    };

    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(
            u => u.Username == request.Username || u.Email == request.Username,
            cancellationToken);

        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        var tenantResolution = await ResolveTenantAccessAsync(user.Id, request.TenantSlug, cancellationToken);
        var (token, expiresAt) = jwtTokenService.CreateToken(
            user,
            tenantResolution?.Tenant,
            tenantResolution?.Membership,
            tenantResolution?.Roles);
        return CreateLoginResponse(token, expiresAt);
    }

    public async Task<LoginResponse?> RefreshAsync(ClaimsPrincipal principal, CancellationToken cancellationToken)
    {
        var user = await ResolveUserAsync(principal, cancellationToken);
        if (user is null)
        {
            return null;
        }

        var tenantResolution = await ResolveTenantAccessAsync(
            user.Id,
            tenantContextAccessor.Current.TenantSlug,
            cancellationToken);

        var (token, expiresAt) = jwtTokenService.CreateToken(
            user,
            tenantResolution?.Tenant,
            tenantResolution?.Membership,
            tenantResolution?.Roles);
        return CreateLoginResponse(token, expiresAt);
    }

    public async Task<RegisterByInviteResult> RegisterByInviteAsync(
        RegisterByInviteRequest request,
        CancellationToken cancellationToken)
    {
        var validationErrors = ValidateInviteRegistrationRequest(request);
        if (validationErrors.Count > 0)
        {
            return new RegisterByInviteResult(
                null,
                ValidationProblem: new ValidationProblemDetails(validationErrors)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Проверьте корректность заполнения полей."
                });
        }

        var normalizedCode = request.InviteCode.Trim().ToUpperInvariant();
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var normalizedSex = request.Sex.Trim().ToLowerInvariant();

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        var invite = await dbContext.PatientInviteCodes
            .Include(x => x.Tenant)
            .FirstOrDefaultAsync(x => x.Code == normalizedCode, cancellationToken);

        if (invite is null)
        {
            return new RegisterByInviteResult(
                null,
                Problem: CreateProblem(StatusCodes.Status404NotFound, "Код приглашения не найден."));
        }

        if (string.Equals(invite.Status, "revoked", StringComparison.OrdinalIgnoreCase))
        {
            return new RegisterByInviteResult(
                null,
                Problem: CreateProblem(StatusCodes.Status409Conflict, "Код приглашения отозван."));
        }

        if (string.Equals(invite.Status, "used", StringComparison.OrdinalIgnoreCase)
            || invite.UsedAt.HasValue
            || invite.UsedByMembershipId.HasValue)
        {
            return new RegisterByInviteResult(
                null,
                Problem: CreateProblem(StatusCodes.Status409Conflict, "Код приглашения уже использован."));
        }

        if (invite.ExpiresAt <= DateTime.UtcNow || string.Equals(invite.Status, "expired", StringComparison.OrdinalIgnoreCase))
        {
            invite.Status = "expired";
            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return new RegisterByInviteResult(
                null,
                Problem: CreateProblem(StatusCodes.Status409Conflict, "Срок действия кода приглашения истек."));
        }

        if (!string.Equals(invite.Status, "active", StringComparison.OrdinalIgnoreCase))
        {
            return new RegisterByInviteResult(
                null,
                Problem: CreateProblem(StatusCodes.Status409Conflict, "Код приглашения недоступен для использования."));
        }

        var existingUser = await dbContext.Users.AnyAsync(
            u => u.Email == normalizedEmail || u.Username == normalizedEmail,
            cancellationToken);

        if (existingUser)
        {
            return new RegisterByInviteResult(
                null,
                Problem: CreateProblem(StatusCodes.Status409Conflict, "Пользователь с таким адресом уже существует."));
        }

        var patientRole = await dbContext.Roles.FirstOrDefaultAsync(r => r.Name == "Patient", cancellationToken);
        if (patientRole is null)
        {
            return new RegisterByInviteResult(
                null,
                Problem: CreateProblem(StatusCodes.Status409Conflict, "Роль пациента не настроена в системе."));
        }

        var createdAt = DateTime.UtcNow;
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = normalizedEmail,
            Username = normalizedEmail,
            PasswordHash = passwordHasher.HashPassword(request.Password),
            Status = "Active",
            CreatedAt = createdAt
        };

        var membership = new Membership
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TenantId = invite.TenantId,
            Status = "Active",
            CreatedAt = createdAt
        };

        var membershipRole = new MembershipRole
        {
            MembershipId = membership.Id,
            RoleId = patientRole.Id
        };

        var patientProfile = new PatientProfile
        {
            Id = Guid.NewGuid(),
            TenantId = invite.TenantId,
            MembershipId = membership.Id,
            DisplayName = request.FullName.Trim(),
            BirthDate = request.BirthDate,
            Sex = normalizedSex,
            CreatedAt = createdAt
        };

        invite.Status = "used";
        invite.UsedAt = createdAt;
        invite.UsedByMembershipId = membership.Id;

        dbContext.Users.Add(user);
        dbContext.Memberships.Add(membership);
        dbContext.MembershipRoles.Add(membershipRole);
        dbContext.Patients.Add(patientProfile);

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        var (token, expiresAt) = jwtTokenService.CreateToken(
            user,
            invite.Tenant,
            membership,
            ["Patient"]);
        return new RegisterByInviteResult(CreateLoginResponse(token, expiresAt));
    }

    public async Task<MeResponse?> GetCurrentUserAsync(ClaimsPrincipal principal, CancellationToken cancellationToken)
    {
        var user = await ResolveUserAsync(principal, cancellationToken);
        if (user is null)
        {
            return null;
        }

        var tenantContext = tenantContextAccessor.Current;
        Guid? patientId = null;
        Guid? doctorId = null;

        if (tenantContext.MembershipId.HasValue && tenantContext.TenantId.HasValue)
        {
            patientId = await dbContext.Patients
                .Where(p => p.TenantId == tenantContext.TenantId.Value && p.MembershipId == tenantContext.MembershipId.Value)
                .Select(p => (Guid?)p.Id)
                .FirstOrDefaultAsync(cancellationToken);

            doctorId = await dbContext.Doctors
                .Where(d => d.TenantId == tenantContext.TenantId.Value && d.MembershipId == tenantContext.MembershipId.Value)
                .Select(d => (Guid?)d.Id)
                .FirstOrDefaultAsync(cancellationToken);
        }

        return new MeResponse(
            UserId: user.Id,
            Username: user.Username,
            TenantId: tenantContext.TenantId,
            TenantSlug: tenantContext.TenantSlug,
            MembershipId: tenantContext.MembershipId,
            Roles: tenantContext.Roles,
            PatientId: patientId,
            DoctorId: doctorId);
    }

    private async Task<User?> ResolveUserAsync(ClaimsPrincipal principal, CancellationToken cancellationToken)
    {
        var subject = principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? principal.FindFirstValue("sub");

        if (Guid.TryParse(subject, out var userId))
        {
            return await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        }

        var username = principal.Identity?.Name;
        if (string.IsNullOrWhiteSpace(username))
        {
            return null;
        }

        return await dbContext.Users.FirstOrDefaultAsync(u => u.Username == username, cancellationToken);
    }

    private async Task<TenantAccessResolution?> ResolveTenantAccessAsync(
        Guid userId,
        string? tenantSlug,
        CancellationToken cancellationToken)
    {
        IQueryable<Membership> membershipQuery = dbContext.Memberships
            .Include(m => m.Tenant)
            .Include(m => m.MembershipRoles)
                .ThenInclude(mr => mr.Role)
            .Where(m => m.UserId == userId);

        Membership? membership;
        if (!string.IsNullOrWhiteSpace(tenantSlug))
        {
            membership = await membershipQuery.FirstOrDefaultAsync(
                m => m.Tenant.Slug == tenantSlug,
                cancellationToken);
        }
        else
        {
            membership = await membershipQuery
                .OrderBy(m => m.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);
        }

        if (membership is null)
        {
            return null;
        }

        return new TenantAccessResolution(
            membership.Tenant,
            membership,
            membership.MembershipRoles.Select(mr => mr.Role.Name).ToArray());
    }

    private sealed record TenantAccessResolution(
        Tenant Tenant,
        Membership Membership,
        IReadOnlyCollection<string> Roles);

    private static LoginResponse CreateLoginResponse(string token, DateTime expiresAtUtc)
    {
        var expiresIn = Math.Max(0, (long)(expiresAtUtc - DateTime.UtcNow).TotalSeconds);
        return new LoginResponse(token, expiresIn, token);
    }

    private static ProblemDetails CreateProblem(int status, string title) =>
        new()
        {
            Status = status,
            Title = title
        };

    private static Dictionary<string, string[]> ValidateInviteRegistrationRequest(RegisterByInviteRequest request)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);

        if (string.IsNullOrWhiteSpace(request.InviteCode))
        {
            errors["inviteCode"] = ["Введите код приглашения."];
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors["email"] = ["Введите адрес электронной почты."];
        }
        else
        {
            try
            {
                _ = new MailAddress(request.Email.Trim());
            }
            catch
            {
                errors["email"] = ["Введите корректный адрес электронной почты."];
            }
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            errors["password"] = ["Введите пароль."];
        }
        else if (request.Password.Length < 6)
        {
            errors["password"] = ["Пароль должен содержать не менее 6 символов."];
        }

        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            errors["fullName"] = ["Введите имя пациента."];
        }
        else if (request.FullName.Trim().Length is < 2 or > 256)
        {
            errors["fullName"] = ["Имя пациента должно содержать от 2 до 256 символов."];
        }

        if (!request.BirthDate.HasValue)
        {
            errors["birthDate"] = ["Укажите дату рождения."];
        }
        else if (request.BirthDate.Value > DateOnly.FromDateTime(DateTime.UtcNow.Date))
        {
            errors["birthDate"] = ["Дата рождения не может быть в будущем."];
        }

        if (string.IsNullOrWhiteSpace(request.Sex))
        {
            errors["sex"] = ["Укажите пол."];
        }
        else if (!AllowedSexValues.Contains(request.Sex.Trim()))
        {
            errors["sex"] = ["Допустимые значения пола: male, female, other, unknown."];
        }

        return errors;
    }
}
