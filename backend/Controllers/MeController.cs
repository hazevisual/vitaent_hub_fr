using backend.Application.Auth;
using backend.Application.Authorization;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api")]
public class MeController(IAuthApplicationService authApplicationService) : ControllerBase
{
    [Authorize(Policy = AuthorizationPolicies.TenantMember)]
    [HttpGet("me")]
    public async Task<ActionResult<MeResponse>> Me(CancellationToken cancellationToken)
    {
        var response = await authApplicationService.GetCurrentUserAsync(User, cancellationToken);
        if (response is null)
        {
            return Unauthorized();
        }

        return Ok(response);
    }
}
