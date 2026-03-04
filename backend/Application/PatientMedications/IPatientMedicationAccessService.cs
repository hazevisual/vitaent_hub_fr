using Microsoft.AspNetCore.Mvc;

namespace backend.Application.PatientMedications;

public interface IPatientMedicationAccessService
{
    Task<ProblemDetails?> GetAccessProblemAsync(CancellationToken cancellationToken);
    Task<PatientMedicationActorContext> ResolveActorContextAsync(CancellationToken cancellationToken);
}

public sealed record PatientMedicationActorContext(
    Guid? TenantId,
    Guid? MembershipId,
    Guid? PatientId,
    ProblemDetails? Error);
