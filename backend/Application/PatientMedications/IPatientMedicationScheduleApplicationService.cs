using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Application.PatientMedications;

public interface IPatientMedicationScheduleApplicationService
{
    Task<IReadOnlyList<PatientMedicationSlotDto>> GetListAsync(CancellationToken cancellationToken);
    Task<PatientMedicationSlotMutationResult> CreateSlotAsync(PatientMedicationSlotCreateRequest request, CancellationToken cancellationToken);
    Task<ProblemDetails?> DeleteSlotAsync(Guid id, CancellationToken cancellationToken);
    Task<PatientMedicationSlotItemMutationResult> AddItemAsync(Guid slotId, PatientMedicationSlotItemCreateRequest request, CancellationToken cancellationToken);
    Task<ProblemDetails?> DeleteItemAsync(Guid slotId, Guid itemId, CancellationToken cancellationToken);
}

public sealed record PatientMedicationSlotMutationResult(
    PatientMedicationSlotDto? Slot,
    ProblemDetails? Problem = null,
    ValidationProblemDetails? ValidationProblem = null);

public sealed record PatientMedicationSlotItemMutationResult(
    PatientMedicationSlotItemDto? Item,
    ProblemDetails? Problem = null,
    ValidationProblemDetails? ValidationProblem = null);
