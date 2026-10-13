using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace partcom.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductCompositeLowerIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE INDEX ""IX_Products_Lower_ItemNumber_Brand"" 
                ON ""Products"" ((lower(""ItemNumber"")), (lower(""Brand"")));
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DROP INDEX IF EXISTS ""IX_Products_Lower_ItemNumber_Brand"";
            ");
        }
    }
}
