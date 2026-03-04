using backend.Application.Tenancy;
using backend.Domain.Tenancy;

namespace backend.Infrastructure.Tenancy;

public sealed class HttpTenantContextAccessor : ITenantContextAccessor
{
    public TenantContext Current { get; set; } = new(
        TenantId: null,
        TenantSlug: null,
        ActorUserId: null,
        MembershipId: null,
        Roles: Array.Empty<string>(),
        IsSystemAdmin: false);
}
