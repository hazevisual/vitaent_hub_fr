using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class PatientDashboardBlocks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_patients_membership_id",
                table: "patients");

            migrationBuilder.DropIndex(
                name: "IX_doctors_membership_id",
                table: "doctors");

            migrationBuilder.AddColumn<string>(
                name: "dashboard_appointment_date",
                table: "patients",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "dashboard_appointment_time",
                table: "patients",
                type: "character varying(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "dashboard_completion",
                table: "patients",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "dashboard_completion_day_label",
                table: "patients",
                type: "character varying(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "dashboard_recommendation",
                table: "patients",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "dashboard_summary_date",
                table: "patients",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "dashboard_summary_rows_csv",
                table: "patients",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "dashboard_updated_at",
                table: "patients",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_patients_membership_id",
                table: "patients",
                column: "membership_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_patient_medication_slot_items_tenant_id_patient_id_medicine~",
                table: "patient_medication_slot_items",
                columns: new[] { "tenant_id", "patient_id", "medicine_id" });

            migrationBuilder.CreateIndex(
                name: "IX_doctors_membership_id",
                table: "doctors",
                column: "membership_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_patients_membership_id",
                table: "patients");

            migrationBuilder.DropIndex(
                name: "IX_patient_medication_slot_items_tenant_id_patient_id_medicine~",
                table: "patient_medication_slot_items");

            migrationBuilder.DropIndex(
                name: "IX_doctors_membership_id",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "dashboard_appointment_date",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "dashboard_appointment_time",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "dashboard_completion",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "dashboard_completion_day_label",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "dashboard_recommendation",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "dashboard_summary_date",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "dashboard_summary_rows_csv",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "dashboard_updated_at",
                table: "patients");

            migrationBuilder.CreateIndex(
                name: "IX_patients_membership_id",
                table: "patients",
                column: "membership_id");

            migrationBuilder.CreateIndex(
                name: "IX_doctors_membership_id",
                table: "doctors",
                column: "membership_id");
        }
    }
}
