using backend.Application.Authorization;
using backend.Application.PatientDashboard;
using backend.Application.PatientMedications;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/patient/dashboard-blocks")]
[Authorize(Policy = AuthorizationPolicies.TenantMember)]
public class PatientDashboardBlocksController(
    IPatientMedicationAccessService patientMedicationAccessService,
    IPatientDashboardBlocksApplicationService patientDashboardBlocksApplicationService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PatientDashboardBlockResponse>> Get(CancellationToken cancellationToken)
    {
        var accessProblem = await patientMedicationAccessService.GetAccessProblemAsync(cancellationToken);
        if (accessProblem is not null)
        {
            return StatusCode(accessProblem.Status ?? StatusCodes.Status403Forbidden, accessProblem);
        }

        var response = await patientDashboardBlocksApplicationService.GetAsync(cancellationToken);
        return Ok(response);
    }

    [HttpPut]
    public async Task<ActionResult<PatientDashboardBlockResponse>> Update(
        [FromBody] PatientDashboardBlockUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var result = await patientDashboardBlocksApplicationService.UpdateAsync(request, cancellationToken);
        if (result.ValidationProblem is not null)
        {
            return BadRequest(result.ValidationProblem);
        }

        if (result.Problem is not null)
        {
            return StatusCode(result.Problem.Status ?? StatusCodes.Status403Forbidden, result.Problem);
        }

        return Ok(result.Response);
    }
}
