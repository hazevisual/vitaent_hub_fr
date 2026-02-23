namespace backend.Settings;

public class JwtSettings
{
    public const string SectionName = "JwtSettings";
    public string Key { get; set; } = "dev-only-change-me-super-secret-key-32";
    public int ExpirationMinutes { get; set; } = 60;
}
