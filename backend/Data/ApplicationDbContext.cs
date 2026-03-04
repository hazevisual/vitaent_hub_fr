using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Membership> Memberships => Set<Membership>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<MembershipRole> MembershipRoles => Set<MembershipRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<PatientProfile> Patients => Set<PatientProfile>();
    public DbSet<DoctorProfile> Doctors => Set<DoctorProfile>();
    public DbSet<PatientInviteCode> PatientInviteCodes => Set<PatientInviteCode>();
    public DbSet<PatientMedicine> PatientMedicines => Set<PatientMedicine>();
    public DbSet<PatientMedicationSlot> PatientMedicationSlots => Set<PatientMedicationSlot>();
    public DbSet<PatientMedicationSlotItem> PatientMedicationSlotItems => Set<PatientMedicationSlotItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("users");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Email).HasColumnName("email").IsRequired().HasMaxLength(320);
            entity.Property(x => x.Username).HasColumnName("username").IsRequired().HasMaxLength(256);
            entity.Property(x => x.PasswordHash).HasColumnName("password_hash").IsRequired();
            entity.Property(x => x.Status).HasColumnName("status").IsRequired().HasMaxLength(64);
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(x => x.Email).IsUnique();
            entity.HasIndex(x => x.Username).IsUnique();
        });

        modelBuilder.Entity<Tenant>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("tenants");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Slug).HasColumnName("slug").IsRequired().HasMaxLength(128);
            entity.Property(x => x.Name).HasColumnName("name").IsRequired().HasMaxLength(256);
            entity.Property(x => x.Status).HasColumnName("status").IsRequired().HasMaxLength(64);
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(x => x.Slug).IsUnique();
        });

        modelBuilder.Entity<Membership>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("memberships");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.UserId).HasColumnName("user_id");
            entity.Property(x => x.TenantId).HasColumnName("tenant_id");
            entity.Property(x => x.Status).HasColumnName("status").IsRequired().HasMaxLength(64);
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(x => x.TenantId);
            entity.HasIndex(x => x.UserId);
            entity.HasIndex(x => new { x.TenantId, x.UserId }).IsUnique();
            entity.HasOne(x => x.User)
                .WithMany(x => x.Memberships)
                .HasForeignKey(x => x.UserId);
            entity.HasOne(x => x.Tenant)
                .WithMany(x => x.Memberships)
                .HasForeignKey(x => x.TenantId);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("roles");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Name).HasColumnName("name").IsRequired().HasMaxLength(128);
            entity.Property(x => x.Description).HasColumnName("description").IsRequired().HasMaxLength(512);
            entity.HasIndex(x => x.Name).IsUnique();
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("permissions");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Name).HasColumnName("name").IsRequired().HasMaxLength(256);
            entity.Property(x => x.Description).HasColumnName("description").IsRequired().HasMaxLength(512);
            entity.HasIndex(x => x.Name).IsUnique();
        });

        modelBuilder.Entity<MembershipRole>(entity =>
        {
            entity.HasKey(x => new { x.MembershipId, x.RoleId });
            entity.ToTable("membership_roles");
            entity.Property(x => x.MembershipId).HasColumnName("membership_id");
            entity.Property(x => x.RoleId).HasColumnName("role_id");
            entity.HasIndex(x => x.MembershipId);
            entity.HasIndex(x => x.RoleId);
            entity.HasOne(x => x.Membership)
                .WithMany(x => x.MembershipRoles)
                .HasForeignKey(x => x.MembershipId);
            entity.HasOne(x => x.Role)
                .WithMany(x => x.MembershipRoles)
                .HasForeignKey(x => x.RoleId);
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(x => new { x.RoleId, x.PermissionId });
            entity.ToTable("role_permissions");
            entity.Property(x => x.RoleId).HasColumnName("role_id");
            entity.Property(x => x.PermissionId).HasColumnName("permission_id");
            entity.HasIndex(x => x.RoleId);
            entity.HasIndex(x => x.PermissionId);
            entity.HasOne(x => x.Role)
                .WithMany(x => x.RolePermissions)
                .HasForeignKey(x => x.RoleId);
            entity.HasOne(x => x.Permission)
                .WithMany(x => x.RolePermissions)
                .HasForeignKey(x => x.PermissionId);
        });

        modelBuilder.Entity<PatientProfile>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("patients");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.TenantId).HasColumnName("tenant_id");
            entity.Property(x => x.MembershipId).HasColumnName("membership_id");
            entity.Property(x => x.DisplayName).HasColumnName("display_name").IsRequired().HasMaxLength(256);
            entity.Property(x => x.BirthDate).HasColumnName("birth_date");
            entity.Property(x => x.Sex).HasColumnName("sex").IsRequired().HasMaxLength(32);
            entity.Property(x => x.DashboardCompletion).HasColumnName("dashboard_completion");
            entity.Property(x => x.DashboardCompletionDayLabel).HasColumnName("dashboard_completion_day_label").IsRequired().HasMaxLength(64);
            entity.Property(x => x.DashboardRecommendation).HasColumnName("dashboard_recommendation").IsRequired().HasMaxLength(1024);
            entity.Property(x => x.DashboardAppointmentTime).HasColumnName("dashboard_appointment_time").IsRequired().HasMaxLength(16);
            entity.Property(x => x.DashboardAppointmentDate).HasColumnName("dashboard_appointment_date").IsRequired().HasMaxLength(32);
            entity.Property(x => x.DashboardSummaryDate).HasColumnName("dashboard_summary_date").IsRequired().HasMaxLength(32);
            entity.Property(x => x.DashboardSummaryRowsCsv).HasColumnName("dashboard_summary_rows_csv").IsRequired().HasMaxLength(128);
            entity.Property(x => x.DashboardUpdatedAt).HasColumnName("dashboard_updated_at");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(x => x.TenantId);
            entity.HasIndex(x => x.MembershipId);
            entity.HasIndex(x => new { x.TenantId, x.Id }).IsUnique();
            entity.HasIndex(x => new { x.TenantId, x.MembershipId }).IsUnique();
            entity.HasOne(x => x.Tenant)
                .WithMany(x => x.PatientProfiles)
                .HasForeignKey(x => x.TenantId);
            entity.HasOne(x => x.Membership)
                .WithOne(x => x.PatientProfile)
                .HasForeignKey<PatientProfile>(x => x.MembershipId);
        });

        modelBuilder.Entity<DoctorProfile>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("doctors");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.TenantId).HasColumnName("tenant_id");
            entity.Property(x => x.MembershipId).HasColumnName("membership_id");
            entity.Property(x => x.Specialty).HasColumnName("specialty").IsRequired().HasMaxLength(256);
            entity.Property(x => x.Experience).HasColumnName("experience");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(x => x.TenantId);
            entity.HasIndex(x => x.MembershipId);
            entity.HasIndex(x => new { x.TenantId, x.MembershipId }).IsUnique();
            entity.HasOne(x => x.Tenant)
                .WithMany(x => x.DoctorProfiles)
                .HasForeignKey(x => x.TenantId);
            entity.HasOne(x => x.Membership)
                .WithOne(x => x.DoctorProfile)
                .HasForeignKey<DoctorProfile>(x => x.MembershipId);
        });

        modelBuilder.Entity<PatientInviteCode>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("patient_invite_codes");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.TenantId).HasColumnName("tenant_id");
            entity.Property(x => x.Code).HasColumnName("code").IsRequired().HasMaxLength(64);
            entity.Property(x => x.Status).HasColumnName("status").IsRequired().HasMaxLength(32);
            entity.Property(x => x.CreatedByDoctorId).HasColumnName("created_by_doctor_id");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.ExpiresAt).HasColumnName("expires_at");
            entity.Property(x => x.UsedAt).HasColumnName("used_at");
            entity.Property(x => x.UsedByMembershipId).HasColumnName("used_by_membership_id");
            entity.HasIndex(x => new { x.TenantId, x.Code }).IsUnique();
            entity.HasIndex(x => new { x.TenantId, x.Status });
            entity.HasIndex(x => x.ExpiresAt);
            entity.HasIndex(x => x.CreatedByDoctorId);
            entity.HasOne(x => x.Tenant)
                .WithMany(x => x.PatientInviteCodes)
                .HasForeignKey(x => x.TenantId);
            entity.HasOne(x => x.CreatedByDoctor)
                .WithMany(x => x.CreatedInviteCodes)
                .HasForeignKey(x => x.CreatedByDoctorId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.UsedByMembership)
                .WithMany(x => x.UsedInviteCodes)
                .HasForeignKey(x => x.UsedByMembershipId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PatientMedicine>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("patient_medicines");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.TenantId).HasColumnName("tenant_id");
            entity.Property(x => x.PatientId).HasColumnName("patient_id");
            entity.Property(x => x.Name).HasColumnName("name").IsRequired().HasMaxLength(256);
            entity.Property(x => x.Strength).HasColumnName("strength").HasMaxLength(128);
            entity.Property(x => x.Form).HasColumnName("form").HasMaxLength(128);
            entity.Property(x => x.Note).HasColumnName("note").HasMaxLength(1024);
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(x => new { x.TenantId, x.PatientId });
            entity.HasIndex(x => new { x.TenantId, x.PatientId, x.Id }).IsUnique();
            entity.HasOne(x => x.Tenant)
                .WithMany(x => x.PatientMedicines)
                .HasForeignKey(x => x.TenantId);
            entity.HasOne(x => x.Patient)
                .WithMany(x => x.Medicines)
                .HasForeignKey(x => new { x.TenantId, x.PatientId })
                .HasPrincipalKey(x => new { x.TenantId, x.Id })
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PatientMedicationSlot>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("patient_medication_slots");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.TenantId).HasColumnName("tenant_id");
            entity.Property(x => x.PatientId).HasColumnName("patient_id");
            entity.Property(x => x.TimeOfDay).HasColumnName("time_of_day");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(x => new { x.TenantId, x.PatientId });
            entity.HasIndex(x => new { x.TenantId, x.PatientId, x.Id }).IsUnique();
            entity.HasOne(x => x.Tenant)
                .WithMany(x => x.PatientMedicationSlots)
                .HasForeignKey(x => x.TenantId);
            entity.HasOne(x => x.Patient)
                .WithMany(x => x.MedicationSlots)
                .HasForeignKey(x => new { x.TenantId, x.PatientId })
                .HasPrincipalKey(x => new { x.TenantId, x.Id })
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PatientMedicationSlotItem>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.ToTable("patient_medication_slot_items");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.TenantId).HasColumnName("tenant_id");
            entity.Property(x => x.PatientId).HasColumnName("patient_id");
            entity.Property(x => x.SlotId).HasColumnName("slot_id");
            entity.Property(x => x.MedicineId).HasColumnName("medicine_id");
            entity.Property(x => x.DoseAmount).HasColumnName("dose_amount").HasPrecision(10, 2);
            entity.Property(x => x.Instructions).HasColumnName("instructions").HasMaxLength(1024);
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(x => new { x.TenantId, x.PatientId });
            entity.HasIndex(x => new { x.TenantId, x.PatientId, x.SlotId, x.MedicineId }).IsUnique();
            entity.HasOne(x => x.Tenant)
                .WithMany(x => x.PatientMedicationSlotItems)
                .HasForeignKey(x => x.TenantId);
            entity.HasOne(x => x.Patient)
                .WithMany(x => x.MedicationSlotItems)
                .HasForeignKey(x => new { x.TenantId, x.PatientId })
                .HasPrincipalKey(x => new { x.TenantId, x.Id })
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Slot)
                .WithMany(x => x.Items)
                .HasForeignKey(x => new { x.TenantId, x.PatientId, x.SlotId })
                .HasPrincipalKey(x => new { x.TenantId, x.PatientId, x.Id })
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Medicine)
                .WithMany(x => x.SlotItems)
                .HasForeignKey(x => new { x.TenantId, x.PatientId, x.MedicineId })
                .HasPrincipalKey(x => new { x.TenantId, x.PatientId, x.Id })
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
