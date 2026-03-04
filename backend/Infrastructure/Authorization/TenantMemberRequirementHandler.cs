using backend.Application.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace backend.Infrastructure.Authorization;

public sealed class TenantMemberRequirementHandler(IRoleAuthorizationService roleAuthorizationService)
    : AuthorizationHandler<TenantMemberRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        TenantMemberRequirement requirement)
    {
        if (roleAuthorizationService.HasTenantAccess())
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
