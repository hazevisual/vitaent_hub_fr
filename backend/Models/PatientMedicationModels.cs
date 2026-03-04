namespace backend.Models;

public record PatientMedicineDto(
    Guid Id,
    string Name,
    string? Strength,
    string? Form,
    string? Note,
    DateTime CreatedAt);

public record PatientMedicineCreateRequest(
    string Name,
    string? Strength,
    string? Form,
    string? Note);

public record PatientMedicineUpdateRequest(
    string Name,
    string? Strength,
    string? Form,
    string? Note);

public record PatientMedicationSlotItemDto(
    Guid Id,
    Guid MedicineId,
    string MedicineName,
    string? MedicineStrength,
    string? MedicineForm,
    decimal DoseAmount,
    string? Instructions,
    DateTime CreatedAt);

public record PatientMedicationSlotDto(
    Guid Id,
    string TimeOfDay,
    DateTime CreatedAt,
    IReadOnlyList<PatientMedicationSlotItemDto> Items);

public record PatientMedicationSlotCreateRequest(string TimeOfDay);

public record PatientMedicationSlotItemCreateRequest(
    Guid MedicineId,
    decimal DoseAmount,
    string? Instructions);
