using backend.Application.PatientMedications;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Application.PatientDashboard;

public sealed class PatientDashboardBlocksApplicationService(
    ApplicationDbContext dbContext,
    IPatientMedicationAccessService patientMedicationAccessService) : IPatientDashboardBlocksApplicationService
{
    private static readonly int[] DefaultSummaryRows = [62, 44, 57, 39, 51, 36, 28];

    public async Task<PatientDashboardBlockResponse> GetAsync(CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        EnsureAccessible(actorContext);

        var patient = await dbContext.Patients.FirstOrDefaultAsync(
            x => x.TenantId == actorContext.TenantId!.Value && x.Id == actorContext.PatientId!.Value,
            cancellationToken);

        if (patient is null)
        {
            throw new InvalidOperationException("Patient profile is not available for the current tenant.");
        }

        return MapToResponse(patient);
    }

    public async Task<PatientDashboardBlocksMutationResult> UpdateAsync(
        PatientDashboardBlockUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var actorContext = await patientMedicationAccessService.ResolveActorContextAsync(cancellationToken);
        if (actorContext.Error is not null)
        {
            return new PatientDashboardBlocksMutationResult(null, actorContext.Error);
        }

        var validationErrors = ValidateRequest(request);
        if (validationErrors.Count > 0)
        {
            return new PatientDashboardBlocksMutationResult(
                null,
                ValidationProblem: new ValidationProblemDetails(validationErrors)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Проверьте корректность заполнения полей."
                });
        }

        var patient = await dbContext.Patients.FirstOrDefaultAsync(
            x => x.TenantId == actorContext.TenantId!.Value && x.Id == actorContext.PatientId!.Value,
            cancellationToken);

        if (patient is null)
        {
            return new PatientDashboardBlocksMutationResult(
                null,
                CreateProblem(StatusCodes.Status404NotFound, "Профиль пациента не найден для текущей клиники."));
        }

        var normalizedData = NormalizeData(request.Data);

        patient.DashboardCompletion = normalizedData.Completion;
        patient.DashboardCompletionDayLabel = normalizedData.CompletionDayLabel;
        patient.DashboardRecommendation = normalizedData.Recommendation;
        patient.DashboardAppointmentTime = normalizedData.AppointmentTime;
        patient.DashboardAppointmentDate = normalizedData.AppointmentDate;
        patient.DashboardSummaryDate = normalizedData.SummaryDate;
        patient.DashboardSummaryRowsCsv = string.Join(",", normalizedData.SummaryRows);
        patient.DashboardUpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        return new PatientDashboardBlocksMutationResult(MapToResponse(patient));
    }

    private static Dictionary<string, string[]> ValidateRequest(PatientDashboardBlockUpdateRequest? request)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);
        var data = request?.Data;

        if (data is null)
        {
            errors["data"] = ["Передайте данные блока для сохранения."];
            return errors;
        }

        if (data.Completion is < 0 or > 100)
        {
            errors["data.completion"] = ["Процент заполнения должен быть в диапазоне от 0 до 100."];
        }

        ValidateRequiredText(errors, "data.completionDayLabel", data.CompletionDayLabel, 64, "Название дня");
        ValidateRequiredText(errors, "data.recommendation", data.Recommendation, 1024, "Рекомендация");
        ValidateRequiredText(errors, "data.appointmentTime", data.AppointmentTime, 16, "Время приема");
        ValidateRequiredText(errors, "data.appointmentDate", data.AppointmentDate, 32, "Дата приема");
        ValidateRequiredText(errors, "data.summaryDate", data.SummaryDate, 32, "Дата сводки");

        if (data.SummaryRows is null || data.SummaryRows.Count == 0)
        {
            errors["data.summaryRows"] = ["Передайте хотя бы одно значение интенсивности симптома."];
        }
        else
        {
            for (var index = 0; index < data.SummaryRows.Count; index++)
            {
                var value = data.SummaryRows[index];
                if (value is < 0 or > 100)
                {
                    errors[$"data.summaryRows[{index}]"] = ["Значение симптома должно быть в диапазоне от 0 до 100."];
                }
            }
        }

        return errors;
    }

    private static void ValidateRequiredText(
        IDictionary<string, string[]> errors,
        string key,
        string? value,
        int maxLength,
        string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            errors[key] = [$"{fieldName} не должно быть пустым."];
            return;
        }

        if (value.Trim().Length > maxLength)
        {
            errors[key] = [$"{fieldName} не должно превышать {maxLength} символов."];
        }
    }

    private static PatientDashboardBlockDataDto NormalizeData(PatientDashboardBlockDataDto data)
    {
        var summaryRows = data.SummaryRows.Count > 0
            ? data.SummaryRows.Select(x => Math.Clamp(x, 0, 100)).ToArray()
            : DefaultSummaryRows;

        return new PatientDashboardBlockDataDto(
            Math.Clamp(data.Completion, 0, 100),
            data.CompletionDayLabel.Trim(),
            data.Recommendation.Trim(),
            data.AppointmentTime.Trim(),
            data.AppointmentDate.Trim(),
            data.SummaryDate.Trim(),
            summaryRows);
    }

    private static PatientDashboardBlockResponse MapToResponse(PatientProfile patient)
    {
        var parsedRows = ParseSummaryRows(patient.DashboardSummaryRowsCsv);
        var rows = parsedRows.Count > 0 ? parsedRows : DefaultSummaryRows;

        var data = new PatientDashboardBlockDataDto(
            Math.Clamp(patient.DashboardCompletion, 0, 100),
            Fallback(patient.DashboardCompletionDayLabel, "Среду"),
            Fallback(
                patient.DashboardRecommendation,
                "За последнюю неделю вы спите меньше, чем обычно. Обратите внимание на режим сна."),
            Fallback(patient.DashboardAppointmentTime, "11:30"),
            Fallback(patient.DashboardAppointmentDate, "27.01.2026"),
            Fallback(patient.DashboardSummaryDate, "16.02.2026"),
            rows);

        return new PatientDashboardBlockResponse(data, patient.DashboardUpdatedAt);
    }

    private static IReadOnlyList<int> ParseSummaryRows(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return [];
        }

        var rows = new List<int>();
        var parts = value.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        foreach (var part in parts)
        {
            if (!int.TryParse(part, out var parsed))
            {
                continue;
            }

            rows.Add(Math.Clamp(parsed, 0, 100));
        }

        return rows;
    }

    private static string Fallback(string? value, string fallback) =>
        string.IsNullOrWhiteSpace(value) ? fallback : value.Trim();

    private static void EnsureAccessible(PatientMedicationActorContext actorContext)
    {
        if (actorContext.Error is not null)
        {
            throw new InvalidOperationException(actorContext.Error.Title);
        }
    }

    private static ProblemDetails CreateProblem(int status, string title) =>
        new()
        {
            Status = status,
            Title = title
        };
}
