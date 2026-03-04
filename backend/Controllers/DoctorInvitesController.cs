using backend.Application.Authorization;
using backend.Application.DoctorInvites;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/doctor/invites")]
[Authorize(Policy = AuthorizationPolicies.TenantMember)]
public class DoctorInvitesController(IDoctorInviteApplicationService doctorInviteApplicationService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<DoctorInviteCreateResult>> Create(CancellationToken cancellationToken)
    {
        var accessProblem = await doctorInviteApplicationService.GetAccessProblemAsync(cancellationToken);
        if (accessProblem is not null)
        {
            return StatusCode(accessProblem.Status ?? StatusCodes.Status403Forbidden, accessProblem);
        }

        var response = await doctorInviteApplicationService.CreateInviteAsync(cancellationToken);
        return Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<DoctorInviteListItem>>> GetRecent(CancellationToken cancellationToken)
    {
        var accessProblem = await doctorInviteApplicationService.GetAccessProblemAsync(cancellationToken);
        if (accessProblem is not null)
        {
            return StatusCode(accessProblem.Status ?? StatusCodes.Status403Forbidden, accessProblem);
        }

        var response = await doctorInviteApplicationService.GetRecentInvitesAsync(cancellationToken);
        return Ok(response);
    }
}
