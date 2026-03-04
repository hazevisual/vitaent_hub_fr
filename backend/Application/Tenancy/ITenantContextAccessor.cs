using backend.Domain.Tenancy;

namespace backend.Application.Tenancy;

public interface ITenantContextAccessor
{
    TenantContext Current { get; set; }
}
