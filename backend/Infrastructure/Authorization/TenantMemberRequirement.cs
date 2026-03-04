using Microsoft.AspNetCore.Authorization;

namespace backend.Infrastructure.Authorization;

public sealed class TenantMemberRequirement : IAuthorizationRequirement
{
}
