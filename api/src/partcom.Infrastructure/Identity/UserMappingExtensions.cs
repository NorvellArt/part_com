using partcom.Domain.Entities;

namespace partcom.Infrastructure.Identity;

public static class UserMappingExtensions
{
    public static User ToDomain(this ApplicationUser appUser)
    {
        return new User(
            id: appUser.Id,
            email: appUser.Email!,
            firstName: appUser.FirstName,
            lastName: appUser.LastName,
            createdAtUtc: appUser.CreatedAtUtc
        );
    }
}