namespace backend.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Membership> Memberships { get; set; } = new List<Membership>();
}

public class Tenant
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Membership> Memberships { get; set; } = new List<Membership>();
    public ICollection<PatientProfile> PatientProfiles { get; set; } = new List<PatientProfile>();
    public ICollection<DoctorProfile> DoctorProfiles { get; set; } = new List<DoctorProfile>();
    public ICollection<PatientInviteCode> PatientInviteCodes { get; set; } = new List<PatientInviteCode>();
    public ICollection<PatientMedicine> PatientMedicines { get; set; } = new List<PatientMedicine>();
    public ICollection<PatientMedicationSlot> PatientMedicationSlots { get; set; } = new List<PatientMedicationSlot>();
    public ICollection<PatientMedicationSlotItem> PatientMedicationSlotItems { get; set; } = new List<PatientMedicationSlotItem>();
}

public class Membership
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid TenantId { get; set; }
    public string Status { get; set; } = "Active";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
    public ICollection<MembershipRole> MembershipRoles { get; set; } = new List<MembershipRole>();
    public PatientProfile? PatientProfile { get; set; }
    public DoctorProfile? DoctorProfile { get; set; }
    public ICollection<PatientInviteCode> UsedInviteCodes { get; set; } = new List<PatientInviteCode>();
}

public class Role
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public ICollection<MembershipRole> MembershipRoles { get; set; } = new List<MembershipRole>();
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

public class Permission
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

public class MembershipRole
{
    public Guid MembershipId { get; set; }
    public Guid RoleId { get; set; }

    public Membership Membership { get; set; } = null!;
    public Role Role { get; set; } = null!;
}

public class RolePermission
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }

    public Role Role { get; set; } = null!;
    public Permission Permission { get; set; } = null!;
}

public class PatientProfile
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid MembershipId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public DateOnly? BirthDate { get; set; }
    public string Sex { get; set; } = "unknown";
    public int DashboardCompletion { get; set; } = 100;
    public string DashboardCompletionDayLabel { get; set; } = "Среду";
    public string DashboardRecommendation { get; set; } =
        "За последнюю неделю вы спите меньше, чем обычно. Обратите внимание на режим сна.";
    public string DashboardAppointmentTime { get; set; } = "11:30";
    public string DashboardAppointmentDate { get; set; } = "27.01.2026";
    public string DashboardSummaryDate { get; set; } = "16.02.2026";
    public string DashboardSummaryRowsCsv { get; set; } = "62,44,57,39,51,36,28";
    public DateTime DashboardUpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Tenant Tenant { get; set; } = null!;
    public Membership Membership { get; set; } = null!;
    public ICollection<PatientMedicine> Medicines { get; set; } = new List<PatientMedicine>();
    public ICollection<PatientMedicationSlot> MedicationSlots { get; set; } = new List<PatientMedicationSlot>();
    public ICollection<PatientMedicationSlotItem> MedicationSlotItems { get; set; } = new List<PatientMedicationSlotItem>();
}

public class DoctorProfile
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid MembershipId { get; set; }
    public string Specialty { get; set; } = string.Empty;
    public int? Experience { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Tenant Tenant { get; set; } = null!;
    public Membership Membership { get; set; } = null!;
    public ICollection<PatientInviteCode> CreatedInviteCodes { get; set; } = new List<PatientInviteCode>();
}

public class PatientInviteCode
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
    public Guid CreatedByDoctorId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
    public Guid? UsedByMembershipId { get; set; }

    public Tenant Tenant { get; set; } = null!;
    public DoctorProfile CreatedByDoctor { get; set; } = null!;
    public Membership? UsedByMembership { get; set; }
}

public class PatientMedicine
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid PatientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Strength { get; set; }
    public string? Form { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Tenant Tenant { get; set; } = null!;
    public PatientProfile Patient { get; set; } = null!;
    public ICollection<PatientMedicationSlotItem> SlotItems { get; set; } = new List<PatientMedicationSlotItem>();
}

public class PatientMedicationSlot
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid PatientId { get; set; }
    public TimeOnly TimeOfDay { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Tenant Tenant { get; set; } = null!;
    public PatientProfile Patient { get; set; } = null!;
    public ICollection<PatientMedicationSlotItem> Items { get; set; } = new List<PatientMedicationSlotItem>();
}

public class PatientMedicationSlotItem
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid PatientId { get; set; }
    public Guid SlotId { get; set; }
    public Guid MedicineId { get; set; }
    public decimal DoseAmount { get; set; }
    public string? Instructions { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Tenant Tenant { get; set; } = null!;
    public PatientProfile Patient { get; set; } = null!;
    public PatientMedicationSlot Slot { get; set; } = null!;
    public PatientMedicine Medicine { get; set; } = null!;
}
