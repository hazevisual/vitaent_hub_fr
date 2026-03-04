using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class PatientMedications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddUniqueConstraint(
                name: "AK_patients_tenant_id_id",
                table: "patients",
                columns: new[] { "tenant_id", "id" });

            migrationBuilder.CreateTable(
                name: "patient_medication_slots",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    time_of_day = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patient_medication_slots", x => x.id);
                    table.ForeignKey(
                        name: "FK_patient_medication_slots_patients_tenant_id_patient_id",
                        columns: x => new { x.tenant_id, x.patient_id },
                        principalTable: "patients",
                        principalColumns: new[] { "tenant_id", "id" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_patient_medication_slots_tenants_tenant_id",
                        column: x => x.tenant_id,
                        principalTable: "tenants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "patient_medicines",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    strength = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    form = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    note = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patient_medicines", x => x.id);
                    table.ForeignKey(
                        name: "FK_patient_medicines_patients_tenant_id_patient_id",
                        columns: x => new { x.tenant_id, x.patient_id },
                        principalTable: "patients",
                        principalColumns: new[] { "tenant_id", "id" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_patient_medicines_tenants_tenant_id",
                        column: x => x.tenant_id,
                        principalTable: "tenants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_patient_medication_slots_tenant_id_patient_id",
                table: "patient_medication_slots",
                columns: new[] { "tenant_id", "patient_id" });

            migrationBuilder.AddUniqueConstraint(
                name: "AK_patient_medication_slots_tenant_id_patient_id_id",
                table: "patient_medication_slots",
                columns: new[] { "tenant_id", "patient_id", "id" });

            migrationBuilder.CreateIndex(
                name: "IX_patient_medicines_tenant_id_patient_id",
                table: "patient_medicines",
                columns: new[] { "tenant_id", "patient_id" });

            migrationBuilder.AddUniqueConstraint(
                name: "AK_patient_medicines_tenant_id_patient_id_id",
                table: "patient_medicines",
                columns: new[] { "tenant_id", "patient_id", "id" });

            migrationBuilder.CreateTable(
                name: "patient_medication_slot_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    patient_id = table.Column<Guid>(type: "uuid", nullable: false),
                    slot_id = table.Column<Guid>(type: "uuid", nullable: false),
                    medicine_id = table.Column<Guid>(type: "uuid", nullable: false),
                    dose_amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    instructions = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patient_medication_slot_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_patient_medication_slot_items_patient_medication_slots_tenant_id_patient_id_slot_id",
                        columns: x => new { x.tenant_id, x.patient_id, x.slot_id },
                        principalTable: "patient_medication_slots",
                        principalColumns: new[] { "tenant_id", "patient_id", "id" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_patient_medication_slot_items_patient_medicines_tenant_id_patient_id_medicine_id",
                        columns: x => new { x.tenant_id, x.patient_id, x.medicine_id },
                        principalTable: "patient_medicines",
                        principalColumns: new[] { "tenant_id", "patient_id", "id" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_patient_medication_slot_items_patients_tenant_id_patient_id",
                        columns: x => new { x.tenant_id, x.patient_id },
                        principalTable: "patients",
                        principalColumns: new[] { "tenant_id", "id" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_patient_medication_slot_items_tenants_tenant_id",
                        column: x => x.tenant_id,
                        principalTable: "tenants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_patient_medication_slot_items_tenant_id_patient_id",
                table: "patient_medication_slot_items",
                columns: new[] { "tenant_id", "patient_id" });

            migrationBuilder.CreateIndex(
                name: "IX_patient_medication_slot_items_tenant_id_patient_id_slot_id_medicine_id",
                table: "patient_medication_slot_items",
                columns: new[] { "tenant_id", "patient_id", "slot_id", "medicine_id" },
                unique: true);

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "patient_medication_slot_items");

            migrationBuilder.DropTable(
                name: "patient_medication_slots");

            migrationBuilder.DropTable(
                name: "patient_medicines");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_patients_tenant_id_id",
                table: "patients");
        }
    }
}
