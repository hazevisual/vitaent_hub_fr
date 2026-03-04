using backend.Application.Authorization;
using backend.Application.Tenancy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = AuthorizationPolicies.ClinicAdminOrSystemAdmin)]
public class AdminController(ITenantContextAccessor tenantContextAccessor) : ControllerBase
{
    [HttpGet("context")]
    public ActionResult<object> GetTenantAdminContext()
    {
        var tenantContext = tenantContextAccessor.Current;

        return Ok(new
        {
            tenantId = tenantContext.TenantId,
            tenantSlug = tenantContext.TenantSlug,
            membershipId = tenantContext.MembershipId,
            roles = tenantContext.Roles,
            isSystemAdmin = tenantContext.IsSystemAdmin
        });
    }
}
