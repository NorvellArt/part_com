using partcom.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace partcom.Infrastructure.Persistence;

public class ProductEntity
{
    public Guid Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string ItemNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string? ImageUrl { get; set; }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<ProductEntity> Products => Set<ProductEntity>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresExtension("pg_trgm");

        modelBuilder.Entity<ProductEntity>(entity =>
        {
            entity.ToTable("Products");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Brand).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ItemNumber).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Price).HasPrecision(18, 2);

            entity.HasIndex(e => new { e.ItemNumber, e.Brand }, "IX_Products_Lower_ItemNumber_Brand");

            entity.HasIndex(e => e.ItemNumber)
                  .HasMethod("gin")
                  .HasOperators("gin_trgm_ops");

            entity.HasIndex(e => e.Name)
                  .HasMethod("gin")
                  .HasOperators("gin_trgm_ops");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(e => e.UserId);
        });
    }
}