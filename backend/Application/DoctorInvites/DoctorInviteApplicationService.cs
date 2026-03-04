using System.Security.Cryptography;
using backend.Application.Authorization;
using backend.Application.Tenancy;
using backend.Data;
using backend.Models;
using backend.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace backend.Application.DoctorInvites;

public sealed class DoctorInviteApplicationService(
    ApplicationDbContext dbContext,
    ITenantContextAccessor tenantContextAccessor,
    IRoleAuthorizationService roleAuthorizationService,
    IOptions<InviteCodeSettings> inviteCodeOptions,
    IWebHostEnvironment environment,
    ILogger<DoctorInviteApplicationService> logger) : IDoctorInviteApplicationService
{
    private const string ActiveStatus = "active";
    private static readonly char[] CodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".ToCharArray();
    private readonly InviteCodeSettings _inviteCodeSettings = inviteCodeOptions.Value;

    public async Task<ProblemDetails?> GetAccessProblemAsync(CancellationToken cancellationToken)
    {
        var actorContext = await ResolveActorContextAsync(cancellationToken);
        return actorContext.Error;
    }

    public async Task<DoctorInviteCreateResult> CreateInviteAsync(CancellationToken cancellationToken)
    {
        var actorContext = await ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            throw new InvalidOperationException(actorContext.Error.Title);
        }

        var expiresAt = DateTime.UtcNow.AddDays(Math.Max(1, _inviteCodeSettings.DefaultExpiryDays));
        var code = await GenerateUniqueCodeAsync(cancellationToken);

        var inviteCode = new PatientInviteCode
        {
            Id = Guid.NewGuid(),
            TenantId = actorContext.TenantId!.Value,
            Code = code,
            Status = ActiveStatus,
            CreatedByDoctorId = actorContext.DoctorId!.Value,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt
        };

        dbContext.PatientInviteCodes.Add(inviteCode);
        await dbContext.SaveChangesAsync(cancellationToken);

        if (environment.IsDevelopment())
        {
            logger.LogInformation(
                "Сгенерирован код приглашения пациента для tenant {TenantId} врачом {DoctorId}: {InviteCode} до {ExpiresAt}",
                actorContext.TenantId,
                actorContext.DoctorId,
                inviteCode.Code,
                inviteCode.ExpiresAt);
        }

        return new DoctorInviteCreateResult(inviteCode.Code, inviteCode.ExpiresAt);
    }

    public async Task<IReadOnlyList<DoctorInviteListItem>> GetRecentInvitesAsync(CancellationToken cancellationToken)
    {
        var actorContext = await ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            throw new InvalidOperationException(actorContext.Error.Title);
        }

        return await dbContext.PatientInviteCodes
            .Where(x => x.TenantId == actorContext.TenantId!.Value && x.CreatedByDoctorId == actorContext.DoctorId!.Value)
            .OrderByDescending(x => x.CreatedAt)
            .Take(20)
            .Select(x => new DoctorInviteListItem(
                x.Code,
                x.Status,
                x.CreatedAt,
                x.ExpiresAt,
                x.UsedAt))
            .ToListAsync(cancellationToken);
    }

    private async Task<InviteActorContext> ResolveActorContextAsync(CancellationToken cancellationToken)
    {
        var tenantContext = tenantContextAccessor.Current;

        if (!tenantContext.TenantId.HasValue || !tenantContext.MembershipId.HasValue)
        {
            return new InviteActorContext(
                null,
                null,
                new ProblemDetails
                {
                    Status = StatusCodes.Status403Forbidden,
                    Title = "Не удалось определить клинику текущего пользователя."
                });
        }

        if (!roleAuthorizationService.IsInRole("Doctor"))
        {
            return new InviteActorContext(
                null,
                null,
                new ProblemDetails
                {
                    Status = StatusCodes.Status403Forbidden,
                    Title = "Только врач может генерировать коды приглашения."
                });
        }

        var doctorProfile = await dbContext.Doctors.FirstOrDefaultAsync(
            d => d.TenantId == tenantContext.TenantId.Value && d.MembershipId == tenantContext.MembershipId.Value,
            cancellationToken);

        if (doctorProfile is null)
        {
            return new InviteActorContext(
                tenantContext.TenantId,
                null,
                new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "Профиль врача не найден для текущей клиники."
                });
        }

        return new InviteActorContext(tenantContext.TenantId, doctorProfile.Id, null);
    }

    private async Task<string> GenerateUniqueCodeAsync(CancellationToken cancellationToken)
    {
        for (var attempt = 0; attempt < 10; attempt++)
        {
            var code = CreateHumanReadableCode();
            var exists = await dbContext.PatientInviteCodes.AnyAsync(x => x.Code == code, cancellationToken);

            if (!exists)
            {
                return code;
            }
        }

        throw new InvalidOperationException("Не удалось сгенерировать уникальный код приглашения.");
    }

    private static string CreateHumanReadableCode()
    {
        Span<byte> randomBytes = stackalloc byte[10];
        RandomNumberGenerator.Fill(randomBytes);

        Span<char> chars = stackalloc char[10];
        for (var index = 0; index < chars.Length; index++)
        {
            chars[index] = CodeAlphabet[randomBytes[index] % CodeAlphabet.Length];
        }

        return $"{new string(chars[..5])}-{new string(chars[5..])}";
    }

    private sealed record InviteActorContext(Guid? TenantId, Guid? DoctorId, ProblemDetails? Error);
}
