using backend.Application.Tenancy;

namespace backend.Application.Authorization;

public sealed class RoleAuthorizationService(ITenantContextAccessor tenantContextAccessor) : IRoleAuthorizationService
{
    public bool HasTenantAccess()
    {
        var tenantContext = tenantContextAccessor.Current;
        return tenantContext.IsSystemAdmin || (tenantContext.TenantId.HasValue && tenantContext.MembershipId.HasValue);
    }

    public bool IsInRole(string role)
    {
        return tenantContextAccessor.Current.Roles.Contains(role, StringComparer.OrdinalIgnoreCase);
    }

    public bool IsClinicAdminOrSystemAdmin()
    {
        return IsInRole("ClinicAdmin") || tenantContextAccessor.Current.IsSystemAdmin;
    }
}
