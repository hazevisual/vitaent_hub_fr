using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.PatientMedications;

public sealed class PatientMedicineApplicationService(
    ApplicationDbContext dbContext,
    IPatientMedicationAccessService patientMedicationAccessService) : IPatientMedicineApplicationService
{
    public async Task<IReadOnlyList<PatientMedicineDto>> GetListAsync(CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        EnsureAccessible(actorContext);

        return await dbContext.PatientMedicines
            .Where(x => x.TenantId == actorContext.TenantId!.Value && x.PatientId == actorContext.PatientId!.Value)
            .OrderBy(x => x.Name)
            .ThenBy(x => x.CreatedAt)
            .Select(x => new PatientMedicineDto(
                x.Id,
                x.Name,
                x.Strength,
                x.Form,
                x.Note,
                x.CreatedAt))
            .ToListAsync(cancellationToken);
    }

    public async Task<PatientMedicineGetResult> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            return new PatientMedicineGetResult(null, actorContext.Error);
        }

        var medicine = await FindOwnedMedicineQuery(actorContext, id)
            .Select(x => new PatientMedicineDto(
                x.Id,
                x.Name,
                x.Strength,
                x.Form,
                x.Note,
                x.CreatedAt))
            .FirstOrDefaultAsync(cancellationToken);

        return medicine is null
            ? new PatientMedicineGetResult(null, CreateProblem(StatusCodes.Status404NotFound, "Лекарство не найдено."))
            : new PatientMedicineGetResult(medicine);
    }

    public async Task<PatientMedicineMutationResult> CreateAsync(
        PatientMedicineCreateRequest request,
        CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            return new PatientMedicineMutationResult(null, actorContext.Error);
        }

        var validationErrors = ValidateRequest(request.Name, request.Strength, request.Form, request.Note);
        if (validationErrors.Count > 0)
        {
            return new PatientMedicineMutationResult(
                null,
                ValidationProblem: new ValidationProblemDetails(validationErrors)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Проверьте корректность заполнения полей."
                });
        }

        var medicine = new PatientMedicine
        {
            Id = Guid.NewGuid(),
            TenantId = actorContext.TenantId!.Value,
            PatientId = actorContext.PatientId!.Value,
            Name = request.Name.Trim(),
            Strength = NormalizeOptional(request.Strength),
            Form = NormalizeOptional(request.Form),
            Note = NormalizeOptional(request.Note),
            CreatedAt = DateTime.UtcNow
        };

        dbContext.PatientMedicines.Add(medicine);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new PatientMedicineMutationResult(MapToDto(medicine));
    }

    public async Task<PatientMedicineMutationResult> UpdateAsync(
        Guid id,
        PatientMedicineUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            return new PatientMedicineMutationResult(null, actorContext.Error);
        }

        var validationErrors = ValidateRequest(request.Name, request.Strength, request.Form, request.Note);
        if (validationErrors.Count > 0)
        {
            return new PatientMedicineMutationResult(
                null,
                ValidationProblem: new ValidationProblemDetails(validationErrors)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Проверьте корректность заполнения полей."
                });
        }

        var medicine = await FindOwnedMedicineQuery(actorContext, id).FirstOrDefaultAsync(cancellationToken);
        if (medicine is null)
        {
            return new PatientMedicineMutationResult(
                null,
                CreateProblem(StatusCodes.Status404NotFound, "Лекарство не найдено."));
        }

        medicine.Name = request.Name.Trim();
        medicine.Strength = NormalizeOptional(request.Strength);
        medicine.Form = NormalizeOptional(request.Form);
        medicine.Note = NormalizeOptional(request.Note);

        await dbContext.SaveChangesAsync(cancellationToken);

        return new PatientMedicineMutationResult(MapToDto(medicine));
    }

    public async Task<ProblemDetails?> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            return actorContext.Error;
        }

        var medicine = await FindOwnedMedicineQuery(actorContext, id).FirstOrDefaultAsync(cancellationToken);
        if (medicine is null)
        {
            return CreateProblem(StatusCodes.Status404NotFound, "Лекарство не найдено.");
        }

        dbContext.PatientMedicines.Remove(medicine);
        await dbContext.SaveChangesAsync(cancellationToken);
        return null;
    }

    private IQueryable<PatientMedicine> FindOwnedMedicineQuery(PatientMedicationActorContext actorContext, Guid id) =>
        dbContext.PatientMedicines.Where(x =>
            x.Id == id
            && x.TenantId == actorContext.TenantId!.Value
            && x.PatientId == actorContext.PatientId!.Value);

    private static void EnsureAccessible(PatientMedicationActorContext actorContext)
    {
        if (actorContext.Error is not null)
        {
            throw new InvalidOperationException(actorContext.Error.Title);
        }
    }

    private static PatientMedicineDto MapToDto(PatientMedicine x) =>
        new(
            x.Id,
            x.Name,
            x.Strength,
            x.Form,
            x.Note,
            x.CreatedAt);

    private static Dictionary<string, string[]> ValidateRequest(
        string name,
        string? strength,
        string? form,
        string? note)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);

        if (string.IsNullOrWhiteSpace(name))
        {
            errors["name"] = ["Введите название лекарства."];
        }
        else if (name.Trim().Length > 256)
        {
            errors["name"] = ["Название лекарства не должно превышать 256 символов."];
        }

        if (!string.IsNullOrWhiteSpace(strength) && strength.Trim().Length > 128)
        {
            errors["strength"] = ["Поле дозировки не должно превышать 128 символов."];
        }

        if (!string.IsNullOrWhiteSpace(form) && form.Trim().Length > 128)
        {
            errors["form"] = ["Поле формы выпуска не должно превышать 128 символов."];
        }

        if (!string.IsNullOrWhiteSpace(note) && note.Trim().Length > 1024)
        {
            errors["note"] = ["Примечание не должно превышать 1024 символа."];
        }

        return errors;
    }

    private static string? NormalizeOptional(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    private static ProblemDetails CreateProblem(int status, string title) =>
        new()
        {
            Status = status,
            Title = title
        };
}
