using backend.Application.Authorization;
using backend.Application.PatientMedications;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/patient/medicines")]
[Authorize(Policy = AuthorizationPolicies.TenantMember)]
public class PatientMedicinesController(
    IPatientMedicationAccessService patientMedicationAccessService,
    IPatientMedicineApplicationService patientMedicineApplicationService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PatientMedicineDto>>> GetList(CancellationToken cancellationToken)
    {
        var accessProblem = await patientMedicationAccessService.GetAccessProblemAsync(cancellationToken);
        if (accessProblem is not null)
        {
            return StatusCode(accessProblem.Status ?? StatusCodes.Status403Forbidden, accessProblem);
        }

        var response = await patientMedicineApplicationService.GetListAsync(cancellationToken);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PatientMedicineDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await patientMedicineApplicationService.GetByIdAsync(id, cancellationToken);
        if (result.Problem is not null)
        {
            return StatusCode(result.Problem.Status ?? StatusCodes.Status404NotFound, result.Problem);
        }

        return Ok(result.Medicine);
    }

    [HttpPost]
    public async Task<ActionResult<PatientMedicineDto>> Create(
        [FromBody] PatientMedicineCreateRequest request,
        CancellationToken cancellationToken)
    {
        var result = await patientMedicineApplicationService.CreateAsync(request, cancellationToken);
        if (result.ValidationProblem is not null)
        {
            return BadRequest(result.ValidationProblem);
        }

        if (result.Problem is not null)
        {
            return StatusCode(result.Problem.Status ?? StatusCodes.Status403Forbidden, result.Problem);
        }

        return Ok(result.Medicine);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PatientMedicineDto>> Update(
        Guid id,
        [FromBody] PatientMedicineUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var result = await patientMedicineApplicationService.UpdateAsync(id, request, cancellationToken);
        if (result.ValidationProblem is not null)
        {
            return BadRequest(result.ValidationProblem);
        }

        if (result.Problem is not null)
        {
            return StatusCode(result.Problem.Status ?? StatusCodes.Status404NotFound, result.Problem);
        }

        return Ok(result.Medicine);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var problem = await patientMedicineApplicationService.DeleteAsync(id, cancellationToken);
        if (problem is not null)
        {
            return StatusCode(problem.Status ?? StatusCodes.Status404NotFound, problem);
        }

        return NoContent();
    }
}
