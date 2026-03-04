namespace backend.Settings;

public sealed class InviteCodeSettings
{
    public const string SectionName = "InviteCodes";

    public int DefaultExpiryDays { get; set; } = 30;
}
