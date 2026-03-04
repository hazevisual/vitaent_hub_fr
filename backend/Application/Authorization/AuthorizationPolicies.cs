namespace backend.Application.Authorization;

public static class AuthorizationPolicies
{
    public const string TenantMember = "TenantMember";
    public const string ClinicAdminOrSystemAdmin = "ClinicAdminOrSystemAdmin";
}
