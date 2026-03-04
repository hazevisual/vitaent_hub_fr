using backend.Application.Authorization;
using backend.Application.Tenancy;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.PatientMedications;

public sealed class PatientMedicationAccessService(
    ApplicationDbContext dbContext,
    ITenantContextAccessor tenantContextAccessor,
    IRoleAuthorizationService roleAuthorizationService) : IPatientMedicationAccessService
{
    public async Task<ProblemDetails?> GetAccessProblemAsync(CancellationToken cancellationToken)
    {
        var actorContext = await ResolveActorContextAsync(cancellationToken);
        return actorContext.Error;
    }

    public async Task<PatientMedicationActorContext> ResolveActorContextAsync(CancellationToken cancellationToken)
    {
        var tenantContext = tenantContextAccessor.Current;

        if (!tenantContext.TenantId.HasValue || !tenantContext.MembershipId.HasValue)
        {
            return new PatientMedicationActorContext(
                null,
                null,
                null,
                CreateProblem(
                    StatusCodes.Status403Forbidden,
                    "Не удалось определить клинику и профиль текущего пациента."));
        }

        if (!roleAuthorizationService.IsInRole("Patient"))
        {
            return new PatientMedicationActorContext(
                tenantContext.TenantId,
                tenantContext.MembershipId,
                null,
                CreateProblem(
                    StatusCodes.Status403Forbidden,
                    "Только пациент может работать со своими лекарствами и расписанием приема."));
        }

        var patientId = await dbContext.Patients
            .Where(p => p.TenantId == tenantContext.TenantId.Value && p.MembershipId == tenantContext.MembershipId.Value)
            .Select(p => (Guid?)p.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (!patientId.HasValue)
        {
            return new PatientMedicationActorContext(
                tenantContext.TenantId,
                tenantContext.MembershipId,
                null,
                CreateProblem(
                    StatusCodes.Status404NotFound,
                    "Профиль пациента не найден для текущей клиники."));
        }

        return new PatientMedicationActorContext(
            tenantContext.TenantId,
            tenantContext.MembershipId,
            patientId.Value,
            null);
    }

    private static ProblemDetails CreateProblem(int status, string title) =>
        new()
        {
            Status = status,
            Title = title
        };
}
