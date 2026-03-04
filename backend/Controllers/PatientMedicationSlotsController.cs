using backend.Application.Authorization;
using backend.Application.PatientMedications;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/patient/medication-slots")]
[Authorize(Policy = AuthorizationPolicies.TenantMember)]
public class PatientMedicationSlotsController(
    IPatientMedicationAccessService patientMedicationAccessService,
    IPatientMedicationScheduleApplicationService patientMedicationScheduleApplicationService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PatientMedicationSlotDto>>> GetList(CancellationToken cancellationToken)
    {
        var accessProblem = await patientMedicationAccessService.GetAccessProblemAsync(cancellationToken);
        if (accessProblem is not null)
        {
            return StatusCode(accessProblem.Status ?? StatusCodes.Status403Forbidden, accessProblem);
        }

        var response = await patientMedicationScheduleApplicationService.GetListAsync(cancellationToken);
        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<PatientMedicationSlotDto>> Create(
        [FromBody] PatientMedicationSlotCreateRequest request,
        CancellationToken cancellationToken)
    {
        var result = await patientMedicationScheduleApplicationService.CreateSlotAsync(request, cancellationToken);
        if (result.ValidationProblem is not null)
        {
            return BadRequest(result.ValidationProblem);
        }

        if (result.Problem is not null)
        {
            return StatusCode(result.Problem.Status ?? StatusCodes.Status403Forbidden, result.Problem);
        }

        return Ok(result.Slot);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var problem = await patientMedicationScheduleApplicationService.DeleteSlotAsync(id, cancellationToken);
        if (problem is not null)
        {
            return StatusCode(problem.Status ?? StatusCodes.Status404NotFound, problem);
        }

        return NoContent();
    }

    [HttpPost("{slotId:guid}/items")]
    public async Task<ActionResult<PatientMedicationSlotItemDto>> AddItem(
        Guid slotId,
        [FromBody] PatientMedicationSlotItemCreateRequest request,
        CancellationToken cancellationToken)
    {
        var result = await patientMedicationScheduleApplicationService.AddItemAsync(slotId, request, cancellationToken);
        if (result.ValidationProblem is not null)
        {
            return BadRequest(result.ValidationProblem);
        }

        if (result.Problem is not null)
        {
            return StatusCode(result.Problem.Status ?? StatusCodes.Status404NotFound, result.Problem);
        }

        return Ok(result.Item);
    }

    [HttpDelete("{slotId:guid}/items/{itemId:guid}")]
    public async Task<IActionResult> DeleteItem(Guid slotId, Guid itemId, CancellationToken cancellationToken)
    {
        var problem = await patientMedicationScheduleApplicationService.DeleteItemAsync(slotId, itemId, cancellationToken);
        if (problem is not null)
        {
            return StatusCode(problem.Status ?? StatusCodes.Status404NotFound, problem);
        }

        return NoContent();
    }
}
