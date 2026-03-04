using System.Globalization;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.PatientMedications;

public sealed class PatientMedicationScheduleApplicationService(
    ApplicationDbContext dbContext,
    IPatientMedicationAccessService patientMedicationAccessService) : IPatientMedicationScheduleApplicationService
{
    public async Task<IReadOnlyList<PatientMedicationSlotDto>> GetListAsync(CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        EnsureAccessible(actorContext);

        var slots = await dbContext.PatientMedicationSlots
            .Where(x => x.TenantId == actorContext.TenantId!.Value && x.PatientId == actorContext.PatientId!.Value)
            .OrderBy(x => x.TimeOfDay)
            .ThenBy(x => x.CreatedAt)
            .Select(x => new PatientMedicationSlotDto(
                x.Id,
                x.TimeOfDay.ToString("HH:mm", CultureInfo.InvariantCulture),
                x.CreatedAt,
                x.Items
                    .OrderBy(i => i.CreatedAt)
                    .Select(i => new PatientMedicationSlotItemDto(
                        i.Id,
                        i.MedicineId,
                        i.Medicine.Name,
                        i.Medicine.Strength,
                        i.Medicine.Form,
                        i.DoseAmount,
                        i.Instructions,
                        i.CreatedAt))
                    .ToList()))
            .ToListAsync(cancellationToken);

        return slots;
    }

    public async Task<PatientMedicationSlotMutationResult> CreateSlotAsync(
        PatientMedicationSlotCreateRequest request,
        CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            return new PatientMedicationSlotMutationResult(null, actorContext.Error);
        }

        var validationErrors = ValidateSlotRequest(request);
        if (validationErrors.Count > 0)
        {
            return new PatientMedicationSlotMutationResult(
                null,
                ValidationProblem: new ValidationProblemDetails(validationErrors)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Проверьте корректность заполнения полей."
                });
        }

        var timeOfDay = ParseTimeOfDay(request.TimeOfDay)!;
        var slot = new PatientMedicationSlot
        {
            Id = Guid.NewGuid(),
            TenantId = actorContext.TenantId!.Value,
            PatientId = actorContext.PatientId!.Value,
            TimeOfDay = timeOfDay.Value,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.PatientMedicationSlots.Add(slot);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new PatientMedicationSlotMutationResult(MapSlotToDto(slot));
    }

    public async Task<ProblemDetails?> DeleteSlotAsync(Guid id, CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            return actorContext.Error;
        }

        var slot = await FindOwnedSlotQuery(actorContext, id).FirstOrDefaultAsync(cancellationToken);
        if (slot is null)
        {
            return CreateProblem(StatusCodes.Status404NotFound, "Временной слот не найден.");
        }

        dbContext.PatientMedicationSlots.Remove(slot);
        await dbContext.SaveChangesAsync(cancellationToken);
        return null;
    }

    public async Task<PatientMedicationSlotItemMutationResult> AddItemAsync(
        Guid slotId,
        PatientMedicationSlotItemCreateRequest request,
        CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            return new PatientMedicationSlotItemMutationResult(null, actorContext.Error);
        }

        var validationErrors = ValidateItemRequest(request);
        if (validationErrors.Count > 0)
        {
            return new PatientMedicationSlotItemMutationResult(
                null,
                ValidationProblem: new ValidationProblemDetails(validationErrors)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Проверьте корректность заполнения полей."
                });
        }

        var slot = await FindOwnedSlotQuery(actorContext, slotId).FirstOrDefaultAsync(cancellationToken);
        if (slot is null)
        {
            return new PatientMedicationSlotItemMutationResult(
                null,
                CreateProblem(StatusCodes.Status404NotFound, "Временной слот не найден."));
        }

        var medicine = await FindOwnedMedicineQuery(actorContext, request.MedicineId).FirstOrDefaultAsync(cancellationToken);
        if (medicine is null)
        {
            return new PatientMedicationSlotItemMutationResult(
                null,
                CreateProblem(StatusCodes.Status404NotFound, "Лекарство не найдено."));
        }

        var duplicateExists = await dbContext.PatientMedicationSlotItems.AnyAsync(
            x => x.TenantId == actorContext.TenantId!.Value
                 && x.PatientId == actorContext.PatientId!.Value
                 && x.SlotId == slotId
                 && x.MedicineId == request.MedicineId,
            cancellationToken);

        if (duplicateExists)
        {
            return new PatientMedicationSlotItemMutationResult(
                null,
                CreateProblem(StatusCodes.Status409Conflict, "Это лекарство уже добавлено в выбранный временной слот."));
        }

        var item = new PatientMedicationSlotItem
        {
            Id = Guid.NewGuid(),
            TenantId = actorContext.TenantId!.Value,
            PatientId = actorContext.PatientId!.Value,
            SlotId = slot.Id,
            MedicineId = medicine.Id,
            DoseAmount = request.DoseAmount,
            Instructions = NormalizeOptional(request.Instructions),
            CreatedAt = DateTime.UtcNow
        };

        dbContext.PatientMedicationSlotItems.Add(item);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new PatientMedicationSlotItemMutationResult(
            new PatientMedicationSlotItemDto(
                item.Id,
                medicine.Id,
                medicine.Name,
                medicine.Strength,
                medicine.Form,
                item.DoseAmount,
                item.Instructions,
                item.CreatedAt));
    }

    public async Task<ProblemDetails?> DeleteItemAsync(Guid slotId, Guid itemId, CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            return actorContext.Error;
        }

        var item = await dbContext.PatientMedicationSlotItems.FirstOrDefaultAsync(
            x => x.Id == itemId
                 && x.SlotId == slotId
                 && x.TenantId == actorContext.TenantId!.Value
                 && x.PatientId == actorContext.PatientId!.Value,
            cancellationToken);

        if (item is null)
        {
            return CreateProblem(StatusCodes.Status404NotFound, "Связь лекарства со временным слотом не найдена.");
        }

        dbContext.PatientMedicationSlotItems.Remove(item);
        await dbContext.SaveChangesAsync(cancellationToken);
        return null;
    }

    private IQueryable<PatientMedicationSlot> FindOwnedSlotQuery(PatientMedicationActorContext actorContext, Guid id) =>
        dbContext.PatientMedicationSlots.Where(x =>
            x.Id == id
            && x.TenantId == actorContext.TenantId!.Value
            && x.PatientId == actorContext.PatientId!.Value);

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

    private static PatientMedicationSlotDto MapSlotToDto(PatientMedicationSlot slot) =>
        new(
            slot.Id,
            slot.TimeOfDay.ToString("HH:mm", CultureInfo.InvariantCulture),
            slot.CreatedAt,
            []);

    private static Dictionary<string, string[]> ValidateSlotRequest(PatientMedicationSlotCreateRequest request)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);

        if (string.IsNullOrWhiteSpace(request.TimeOfDay))
        {
            errors["timeOfDay"] = ["Укажите время приема."];
        }
        else if (!ParseTimeOfDay(request.TimeOfDay).HasValue)
        {
            errors["timeOfDay"] = ["Укажите время в формате ЧЧ:ММ."];
        }

        return errors;
    }

    private static Dictionary<string, string[]> ValidateItemRequest(PatientMedicationSlotItemCreateRequest request)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);

        if (request.MedicineId == Guid.Empty)
        {
            errors["medicineId"] = ["Выберите лекарство."];
        }

        if (request.DoseAmount <= 0)
        {
            errors["doseAmount"] = ["Количество должно быть больше нуля."];
        }

        if (!string.IsNullOrWhiteSpace(request.Instructions) && request.Instructions.Trim().Length > 1024)
        {
            errors["instructions"] = ["Инструкция не должна превышать 1024 символа."];
        }

        return errors;
    }

    private static TimeOnly? ParseTimeOfDay(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return TimeOnly.TryParseExact(
            value.Trim(),
            "HH:mm",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var parsed)
            ? parsed
            : null;
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
