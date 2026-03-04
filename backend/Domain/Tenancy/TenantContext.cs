namespace backend.Domain.Tenancy;

public sealed record TenantContext(
    Guid? TenantId,
    string? TenantSlug,
    Guid? ActorUserId,
    Guid? MembershipId,
    IReadOnlyList<string> Roles,
    bool IsSystemAdmin);
