namespace backend.Application.Authorization;

public interface IRoleAuthorizationService
{
    bool HasTenantAccess();
    bool IsInRole(string role);
    bool IsClinicAdminOrSystemAdmin();
}
