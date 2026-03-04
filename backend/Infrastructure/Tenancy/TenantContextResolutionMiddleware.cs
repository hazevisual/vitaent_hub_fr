using System.Security.Claims;
using backend.Application.Tenancy;
using backend.Data;
using backend.Domain.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Tenancy;

public sealed class TenantContextResolutionMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(
        HttpContext httpContext,
        ITenantContextAccessor tenantContextAccessor,
        ApplicationDbContext dbContext)
    {
        var tenantSlug = httpContext.Request.Headers["X-Tenant-Slug"].FirstOrDefault()
            ?? httpContext.Request.Headers["X-Tenant"].FirstOrDefault()
            ?? httpContext.User.FindFirstValue("tenant_slug");

        Guid? actorUserId = null;
        var subClaim = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? httpContext.User.FindFirstValue("sub");

        if (Guid.TryParse(subClaim, out var parsedUserId))
        {
            actorUserId = parsedUserId;
        }

        Guid? tenantId = null;
        Guid? membershipId = null;
        string[] roles = Array.Empty<string>();

        if (actorUserId.HasValue && !string.IsNullOrWhiteSpace(tenantSlug))
        {
            var membership = await dbContext.Memberships
                .Include(m => m.Tenant)
                .Include(m => m.MembershipRoles)
                    .ThenInclude(mr => mr.Role)
                .FirstOrDefaultAsync(
                    m => m.UserId == actorUserId.Value && m.Tenant.Slug == tenantSlug,
                    httpContext.RequestAborted);

            if (membership is not null)
            {
                tenantId = membership.TenantId;
                membershipId = membership.Id;
                tenantSlug = membership.Tenant.Slug;
                roles = membership.MembershipRoles
                    .Select(mr => mr.Role.Name)
                    .Where(static value => !string.IsNullOrWhiteSpace(value))
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToArray();
            }
        }

        if (roles.Length == 0)
        {
            roles = httpContext.User.FindAll(ClaimTypes.Role)
                .Select(static claim => claim.Value)
                .Where(static value => !string.IsNullOrWhiteSpace(value))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();
        }

        tenantContextAccessor.Current = new TenantContext(
            TenantId: tenantId,
            TenantSlug: string.IsNullOrWhiteSpace(tenantSlug) ? null : tenantSlug,
            ActorUserId: actorUserId,
            MembershipId: membershipId,
            Roles: roles,
            IsSystemAdmin: roles.Contains("SystemAdmin", StringComparer.OrdinalIgnoreCase));

        await next(httpContext);
    }
}
