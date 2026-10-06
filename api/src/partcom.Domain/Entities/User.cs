using partcom.Domain.Exceptions;

namespace partcom.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string Email { get; private set; }
    public string? FirstName { get; private set; }
    public string? LastName { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    public User(
        Guid id,
        string email,
        string? firstName = null,
        string? lastName = null,
        DateTime? createdAtUtc = null)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("Email не может быть пустым.");

        if (!email.Contains('@'))
            throw new DomainException("Некорректный формат Email.");

        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        Email = email.Trim().ToLowerInvariant();
        FirstName = firstName?.Trim();
        LastName = lastName?.Trim();
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void UpdateProfile(string? firstName, string? lastName)
    {
        FirstName = firstName?.Trim();
        LastName = lastName?.Trim();
    }
}