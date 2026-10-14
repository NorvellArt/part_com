using Microsoft.AspNetCore.Identity;

namespace partcom.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}