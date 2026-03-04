using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Application.PatientDashboard;

public interface IPatientDashboardBlocksApplicationService
{
    Task<PatientDashboardBlockResponse> GetAsync(CancellationToken cancellationToken);
    Task<PatientDashboardBlocksMutationResult> UpdateAsync(PatientDashboardBlockUpdateRequest request, CancellationToken cancellationToken);
}

public sealed record PatientDashboardBlocksMutationResult(
    PatientDashboardBlockResponse? Response,
    ProblemDetails? Problem = null,
    ValidationProblemDetails? ValidationProblem = null);
