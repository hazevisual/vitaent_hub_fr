using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Application.PatientMedications;

public interface IPatientMedicineApplicationService
{
    Task<IReadOnlyList<PatientMedicineDto>> GetListAsync(CancellationToken cancellationToken);
    Task<PatientMedicineGetResult> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<PatientMedicineMutationResult> CreateAsync(PatientMedicineCreateRequest request, CancellationToken cancellationToken);
    Task<PatientMedicineMutationResult> UpdateAsync(Guid id, PatientMedicineUpdateRequest request, CancellationToken cancellationToken);
    Task<ProblemDetails?> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public sealed record PatientMedicineGetResult(
    PatientMedicineDto? Medicine,
    ProblemDetails? Problem = null);

public sealed record PatientMedicineMutationResult(
    PatientMedicineDto? Medicine,
    ProblemDetails? Problem = null,
    ValidationProblemDetails? ValidationProblem = null);
