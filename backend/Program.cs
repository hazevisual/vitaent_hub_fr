using backend.Application.Auth;
using backend.Application.Authorization;
using backend.Application.DoctorInvites;
using backend.Application.PatientDashboard;
using backend.Application.PatientMedications;
using backend.Application.Tenancy;
using System.Text;
using backend.Data;
using backend.Infrastructure.Authorization;
using backend.Infrastructure.Tenancy;
using backend.Models;
using backend.Services;
using backend.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));
builder.Services.Configure<InviteCodeSettings>(builder.Configuration.GetSection(InviteCodeSettings.SectionName));

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=vitaent;Username=vitaent;Password=vitaent";

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAuthApplicationService, AuthApplicationService>();
builder.Services.AddScoped<IDoctorInviteApplicationService, DoctorInviteApplicationService>();
builder.Services.AddScoped<IPatientMedicationAccessService, PatientMedicationAccessService>();
builder.Services.AddScoped<IPatientDashboardBlocksApplicationService, PatientDashboardBlocksApplicationService>();
builder.Services.AddScoped<IPatientMedicineApplicationService, PatientMedicineApplicationService>();
builder.Services.AddScoped<IPatientMedicationScheduleApplicationService, PatientMedicationScheduleApplicationService>();
builder.Services.AddScoped<IRoleAuthorizationService, RoleAuthorizationService>();
builder.Services.AddScoped<ITenantContextAccessor, HttpTenantContextAccessor>();

var jwtKey = builder.Configuration["JwtSettings:Key"] ?? "dev-only-change-me-super-secret-key-32";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1)
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(
        AuthorizationPolicies.TenantMember,
        policy => policy.RequireAuthenticatedUser().AddRequirements(new TenantMemberRequirement()));

    options.AddPolicy(
        AuthorizationPolicies.ClinicAdminOrSystemAdmin,
        policy => policy.RequireAuthenticatedUser().AddRequirements(new ClinicAdminOrSystemAdminRequirement()));
});

builder.Services.AddScoped<IAuthorizationHandler, TenantMemberRequirementHandler>();
builder.Services.AddScoped<IAuthorizationHandler, ClinicAdminOrSystemAdminRequirementHandler>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy.WithOrigins("http://localhost:3001")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

    const int maxRetries = 10;
    for (var attempt = 1; attempt <= maxRetries; attempt++)
    {
        try
        {
            logger.LogInformation("Applying migrations (attempt {Attempt}/{MaxRetries})", attempt, maxRetries);
            await db.Database.MigrateAsync();
            logger.LogInformation("Database migrations applied successfully.");
            break;
        }
        catch (Exception ex) when (attempt < maxRetries)
        {
            logger.LogWarning(ex, "Database not ready yet. Retrying in 3 seconds...");
            await Task.Delay(TimeSpan.FromSeconds(3));
        }
    }

    var seededRoles = new[]
    {
        ("Patient", "Patient access inside a tenant"),
        ("Doctor", "Doctor access inside a tenant"),
        ("ClinicAdmin", "Clinic administration access inside a tenant"),
        ("SystemAdmin", "System-wide administrative access")
    };

    var seededPermissions = new[]
    {
        ("appointments.create", "Create appointments"),
        ("appointments.read.own", "Read own appointments"),
        ("patients.read.assigned", "Read assigned patients"),
        ("records.write.assigned", "Write assigned medical records"),
        ("users.manage", "Manage users inside a tenant"),
        ("chat.write", "Write chat messages")
    };

    var developmentAccounts = new[]
    {
        new { Role = "SystemAdmin", Username = "admin", Email = "admin@vitaent.local", Password = "Admin123!" },
        new { Role = "ClinicAdmin", Username = "clinic", Email = "clinic@vitaent.local", Password = "Clinic123!" },
        new { Role = "Doctor", Username = "doctor", Email = "doctor@vitaent.local", Password = "Doctor123!" },
        new { Role = "Patient", Username = "patient", Email = "patient@vitaent.local", Password = "Patient123!" }
    };
    var seededClinics = new[]
    {
        new { Slug = "vita-west", Name = "VitaWest" },
        new { Slug = "vita-south", Name = "VitaSouth" },
        new { Slug = "vita-north", Name = "VitaNorth" },
        new { Slug = "vita-central", Name = "VitaCentral" }
    };
    var clinicDoctorAccounts = new[]
    {
        new { ClinicSlug = "vita-west", ClinicName = "VitaWest", Username = "doctor.vitawest", Email = "doctor.vitawest@vitaent.local", Password = "Doctor123!", Specialty = "Терапевт" },
        new { ClinicSlug = "vita-south", ClinicName = "VitaSouth", Username = "doctor.vitasouth", Email = "doctor.vitasouth@vitaent.local", Password = "Doctor123!", Specialty = "Кардиолог" },
        new { ClinicSlug = "vita-north", ClinicName = "VitaNorth", Username = "doctor.vitanorth", Email = "doctor.vitanorth@vitaent.local", Password = "Doctor123!", Specialty = "Невролог" },
        new { ClinicSlug = "vita-central", ClinicName = "VitaCentral", Username = "doctor.vitacentral", Email = "doctor.vitacentral@vitaent.local", Password = "Doctor123!", Specialty = "Педиатр" }
    };

    foreach (var clinic in seededClinics)
    {
        var tenant = await db.Tenants.FirstOrDefaultAsync(t => t.Slug == clinic.Slug);
        if (tenant is null)
        {
            db.Tenants.Add(new Tenant
            {
                Id = Guid.NewGuid(),
                Slug = clinic.Slug,
                Name = clinic.Name,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            });
        }
    }

    foreach (var (name, description) in seededRoles)
    {
        var existingRole = await db.Roles.FirstOrDefaultAsync(r => r.Name == name);
        if (existingRole is null)
        {
            db.Roles.Add(new Role
            {
                Id = Guid.NewGuid(),
                Name = name,
                Description = description
            });
        }
    }

    foreach (var (name, description) in seededPermissions)
    {
        var existingPermission = await db.Permissions.FirstOrDefaultAsync(p => p.Name == name);
        if (existingPermission is null)
        {
            db.Permissions.Add(new Permission
            {
                Id = Guid.NewGuid(),
                Name = name,
                Description = description
            });
        }
    }

    await db.SaveChangesAsync();

    var tenantBySlug = await db.Tenants.ToDictionaryAsync(t => t.Slug, StringComparer.OrdinalIgnoreCase);
    var defaultTenant = tenantBySlug["vita-west"];

    foreach (var account in developmentAccounts)
    {
        var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == account.Email);
        if (existingUser is null)
        {
            logger.LogInformation("Seeding development account for role {Role}: {Email}", account.Role, account.Email);
            existingUser = new User
            {
                Id = Guid.NewGuid(),
                Email = account.Email,
                Username = account.Username,
                Status = "Active",
                CreatedAt = DateTime.UtcNow,
                PasswordHash = passwordHasher.HashPassword(account.Password)
            };
            db.Users.Add(existingUser);
        }
        else
        {
            logger.LogInformation("Development account exists for role {Role}. Refreshing credentials for: {Email}", account.Role, account.Email);
            existingUser.Username = account.Username;
            existingUser.Status = "Active";
            existingUser.PasswordHash = passwordHasher.HashPassword(account.Password);
        }
    }

    foreach (var account in clinicDoctorAccounts)
    {
        var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == account.Email);
        if (existingUser is null)
        {
            logger.LogInformation("Seeding doctor account for clinic {ClinicName}: {Email}", account.ClinicName, account.Email);
            existingUser = new User
            {
                Id = Guid.NewGuid(),
                Email = account.Email,
                Username = account.Username,
                Status = "Active",
                CreatedAt = DateTime.UtcNow,
                PasswordHash = passwordHasher.HashPassword(account.Password)
            };
            db.Users.Add(existingUser);
        }
        else
        {
            existingUser.Username = account.Username;
            existingUser.Status = "Active";
            existingUser.PasswordHash = passwordHasher.HashPassword(account.Password);
        }
    }

    await db.SaveChangesAsync();

    var clinicAdminRole = await db.Roles.FirstAsync(r => r.Name == "ClinicAdmin");
    var systemAdminRole = await db.Roles.FirstAsync(r => r.Name == "SystemAdmin");
    var doctorRole = await db.Roles.FirstAsync(r => r.Name == "Doctor");
    var patientRole = await db.Roles.FirstAsync(r => r.Name == "Patient");
    var usersManagePermission = await db.Permissions.FirstAsync(p => p.Name == "users.manage");

    foreach (var role in new[] { clinicAdminRole, systemAdminRole })
    {
        var rolePermissionExists = await db.RolePermissions.AnyAsync(
            rp => rp.RoleId == role.Id && rp.PermissionId == usersManagePermission.Id);

        if (!rolePermissionExists)
        {
            db.RolePermissions.Add(new RolePermission
            {
                RoleId = role.Id,
                PermissionId = usersManagePermission.Id
            });
        }
    }

    await db.SaveChangesAsync();

    var roleByName = new Dictionary<string, Role>(StringComparer.OrdinalIgnoreCase)
    {
        ["SystemAdmin"] = systemAdminRole,
        ["ClinicAdmin"] = clinicAdminRole,
        ["Doctor"] = doctorRole,
        ["Patient"] = patientRole
    };

    foreach (var account in developmentAccounts)
    {
        var user = await db.Users.FirstAsync(u => u.Email == account.Email);
        var membership = await db.Memberships.FirstOrDefaultAsync(
            m => m.UserId == user.Id && m.TenantId == defaultTenant.Id);

        if (membership is null)
        {
            membership = new Membership
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                TenantId = defaultTenant.Id,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };
            db.Memberships.Add(membership);
            await db.SaveChangesAsync();
        }
        else
        {
            membership.Status = "Active";
        }

        var role = roleByName[account.Role];
        var membershipRoleExists = await db.MembershipRoles.AnyAsync(
            mr => mr.MembershipId == membership.Id && mr.RoleId == role.Id);

        if (!membershipRoleExists)
        {
            db.MembershipRoles.Add(new MembershipRole
            {
                MembershipId = membership.Id,
                RoleId = role.Id
            });
        }

        if (string.Equals(account.Role, "Doctor", StringComparison.OrdinalIgnoreCase))
        {
            var doctorProfile = await db.Doctors.FirstOrDefaultAsync(
                d => d.TenantId == defaultTenant.Id && d.MembershipId == membership.Id);

            if (doctorProfile is null)
            {
                db.Doctors.Add(new DoctorProfile
                {
                    Id = Guid.NewGuid(),
                    TenantId = defaultTenant.Id,
                    MembershipId = membership.Id,
                    Specialty = "Терапевт",
                    Experience = 5,
                    CreatedAt = DateTime.UtcNow
                });
            }
            else
            {
                doctorProfile.Specialty = "Терапевт";
                doctorProfile.Experience = 5;
            }
        }

        if (string.Equals(account.Role, "Patient", StringComparison.OrdinalIgnoreCase))
        {
            var patientProfile = await db.Patients.FirstOrDefaultAsync(
                p => p.TenantId == defaultTenant.Id && p.MembershipId == membership.Id);

            if (patientProfile is null)
            {
                db.Patients.Add(new PatientProfile
                {
                    Id = Guid.NewGuid(),
                    TenantId = defaultTenant.Id,
                    MembershipId = membership.Id,
                    DisplayName = "Тестовый пациент",
                    BirthDate = new DateOnly(1990, 1, 1),
                    Sex = "unknown",
                    CreatedAt = DateTime.UtcNow
                });
            }
            else
            {
                patientProfile.DisplayName = "Тестовый пациент";
                patientProfile.BirthDate = new DateOnly(1990, 1, 1);
                patientProfile.Sex = "unknown";
            }
        }
    }

    await db.SaveChangesAsync();

    foreach (var account in clinicDoctorAccounts)
    {
        var tenant = tenantBySlug[account.ClinicSlug];
        var user = await db.Users.FirstAsync(u => u.Email == account.Email);
        var membership = await db.Memberships.FirstOrDefaultAsync(
            m => m.UserId == user.Id && m.TenantId == tenant.Id);

        if (membership is null)
        {
            membership = new Membership
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                TenantId = tenant.Id,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };
            db.Memberships.Add(membership);
            await db.SaveChangesAsync();
        }
        else
        {
            membership.Status = "Active";
        }

        var membershipRoleExists = await db.MembershipRoles.AnyAsync(
            mr => mr.MembershipId == membership.Id && mr.RoleId == doctorRole.Id);

        if (!membershipRoleExists)
        {
            db.MembershipRoles.Add(new MembershipRole
            {
                MembershipId = membership.Id,
                RoleId = doctorRole.Id
            });
        }

        var doctorProfile = await db.Doctors.FirstOrDefaultAsync(
            d => d.TenantId == tenant.Id && d.MembershipId == membership.Id);

        if (doctorProfile is null)
        {
            db.Doctors.Add(new DoctorProfile
            {
                Id = Guid.NewGuid(),
                TenantId = tenant.Id,
                MembershipId = membership.Id,
                Specialty = account.Specialty,
                Experience = 5,
                CreatedAt = DateTime.UtcNow
            });
        }
        else
        {
            doctorProfile.Specialty = account.Specialty;
            doctorProfile.Experience = 5;
        }
    }

    await db.SaveChangesAsync();

    logger.LogInformation("Development seed accounts are ready for clinics VitaWest, VitaSouth, VitaNorth, VitaCentral.");
    foreach (var account in developmentAccounts)
    {
        logger.LogInformation(
            "Dev account | role={Role} | email={Email} | password={Password} | tenant={TenantSlug}",
            account.Role,
            account.Email,
            account.Password,
            defaultTenant.Slug);
    }

    foreach (var account in clinicDoctorAccounts)
    {
        logger.LogInformation(
            "Dev doctor | clinic={ClinicName} | email={Email} | password={Password} | tenant={TenantSlug}",
            account.ClinicName,
            account.Email,
            account.Password,
            account.ClinicSlug);
    }

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/health", async (ApplicationDbContext dbContext) =>
{
    try
    {
        var canConnect = await dbContext.Database.CanConnectAsync();
        return canConnect
            ? Results.Ok(new { status = "healthy", database = "reachable" })
            : Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
    }
    catch
    {
        return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
    }
});

app.UseCors("FrontendDev");
app.UseAuthentication();
app.UseMiddleware<TenantContextResolutionMiddleware>();
app.UseAuthorization();
app.MapControllers();

app.Run();
