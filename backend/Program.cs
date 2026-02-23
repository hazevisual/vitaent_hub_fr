using System.Text;
using backend.Data;
using backend.Models;
using backend.Services;
using backend.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=vitaent;Username=vitaent;Password=vitaent";

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

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

builder.Services.AddAuthorization();

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

    const string seededUsername = "vitaent";
    const string seededPassword = "vitaent";

    var seededUser = await db.Users.FirstOrDefaultAsync(u => u.Username == seededUsername);
    if (seededUser is null)
    {
        logger.LogInformation("Seeding default user: {Username}", seededUsername);
        db.Users.Add(new User
        {
            Id = Guid.NewGuid(),
            Username = seededUsername,
            PasswordHash = passwordHasher.HashPassword(seededPassword)
        });
    }
    else
    {
        logger.LogInformation("Default user exists. Updating password for: {Username}", seededUsername);
        seededUser.PasswordHash = passwordHasher.HashPassword(seededPassword);
    }

    await db.SaveChangesAsync();

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
app.UseAuthorization();
app.MapControllers();

app.Run();
