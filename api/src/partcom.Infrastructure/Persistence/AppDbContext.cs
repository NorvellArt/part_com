using partcom.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace partcom.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<ProductEntity> Products => Set<ProductEntity>();
    public DbSet<CategoryEntity> Categories => Set<CategoryEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasCollation("ru_icu_ci", locale: "ru-RU-u-ks-level2", provider: "icu", deterministic: false);
        modelBuilder.HasPostgresExtension("pg_trgm");

        modelBuilder.Entity<CategoryEntity>(entity =>
        {
            entity.ToTable("Categories");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .UseCollation("ru_icu_ci")
                .IsRequired()
                .HasMaxLength(255);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Level).IsRequired();

            entity.HasIndex(e => e.Slug).IsUnique();

            entity.HasOne(e => e.Parent)
                  .WithMany(e => e.Children)
                  .HasForeignKey(e => e.ParentId)
                  .OnDelete(DeleteBehavior.Restrict)
                  .IsRequired(false);

            entity.HasIndex(e => e.ParentId);
        });

        modelBuilder.Entity<ProductEntity>(entity =>
        {
            entity.ToTable("Products");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Brand).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ItemNumber).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DisplayItemNumber).IsRequired().HasMaxLength(100);
            entity.Property(e => e.IsPublished).IsRequired().HasDefaultValue(false);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Price).HasPrecision(18, 2);

            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.CategoryId);

            entity.HasIndex(e => new { e.ItemNumber, e.Brand }, "IX_Products_Lower_ItemNumber_Brand");

            entity.HasIndex(e => e.DisplayItemNumber)
                  .HasMethod("gin")
                  .HasOperators("gin_trgm_ops");

            entity.HasIndex(e => e.Name)
                  .HasMethod("gin")
                  .HasOperators("gin_trgm_ops");

            entity.HasIndex(e => e.IsPublished);
        });
    }
}
