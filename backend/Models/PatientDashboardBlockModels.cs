namespace backend.Models;

public sealed record PatientDashboardBlockDataDto(
    int Completion,
    string CompletionDayLabel,
    string Recommendation,
    string AppointmentTime,
    string AppointmentDate,
    string SummaryDate,
    IReadOnlyList<int> SummaryRows);

public sealed record PatientDashboardBlockResponse(
    PatientDashboardBlockDataDto Data,
    DateTime UpdatedAt);

public sealed record PatientDashboardBlockUpdateRequest(
    PatientDashboardBlockDataDto Data);
