using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace partcom.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRussianIcuCollation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:CollationDefinition:ru_icu_ci", "ru-RU-u-ks-level2,ru-RU-u-ks-level2,icu,False")
                .Annotation("Npgsql:PostgresExtension:pg_trgm", ",,")
                .OldAnnotation("Npgsql:PostgresExtension:pg_trgm", ",,");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Categories",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                collation: "ru_icu_ci",
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:pg_trgm", ",,")
                .OldAnnotation("Npgsql:CollationDefinition:ru_icu_ci", "ru-RU-u-ks-level2,ru-RU-u-ks-level2,icu,False")
                .OldAnnotation("Npgsql:PostgresExtension:pg_trgm", ",,");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Categories",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldCollation: "ru_icu_ci");
        }
    }
}
