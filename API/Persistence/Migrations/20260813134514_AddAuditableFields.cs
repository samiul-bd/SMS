using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditableFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Submissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Submissions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Submissions",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Submissions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Assignments",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Assignments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Assignments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Assignments",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Submissions");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Submissions");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Submissions");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Submissions");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Assignments");
        }
    }
}
