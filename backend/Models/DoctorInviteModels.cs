namespace backend.Models;

public record DoctorInviteCreateResult(string Code, DateTime ExpiresAt);

public record DoctorInviteListItem(
    string Code,
    string Status,
    DateTime CreatedAt,
    DateTime ExpiresAt,
    DateTime? UsedAt);
