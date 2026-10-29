using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace partcom.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductDisplayItemNumberAndPublish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_ItemNumber",
                table: "Products");

            migrationBuilder.AddColumn<string>(
                name: "DisplayItemNumber",
                table: "Products",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql("UPDATE \"Products\" SET \"DisplayItemNumber\" = \"ItemNumber\" WHERE \"DisplayItemNumber\" = '';");

            migrationBuilder.CreateIndex(
                name: "IX_Products_DisplayItemNumber",
                table: "Products",
                column: "DisplayItemNumber")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:IndexOperators", new[] { "gin_trgm_ops" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsPublished",
                table: "Products",
                column: "IsPublished");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_DisplayItemNumber",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_IsPublished",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DisplayItemNumber",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Products");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ItemNumber",
                table: "Products",
                column: "ItemNumber")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:IndexOperators", new[] { "gin_trgm_ops" });
        }
    }
}
