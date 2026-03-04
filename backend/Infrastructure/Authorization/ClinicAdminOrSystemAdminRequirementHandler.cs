using backend.Application.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace backend.Infrastructure.Authorization;

public sealed class ClinicAdminOrSystemAdminRequirementHandler(IRoleAuthorizationService roleAuthorizationService)
    : AuthorizationHandler<ClinicAdminOrSystemAdminRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ClinicAdminOrSystemAdminRequirement requirement)
    {
        if (roleAuthorizationService.IsClinicAdminOrSystemAdmin())
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
