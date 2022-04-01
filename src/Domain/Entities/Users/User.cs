using Domain.Enums;

namespace Domain.Entities.Users;

public class User : BaseEntity
{
    public string Email { get; set; }

    public string Username { get; set; }

    public bool IsEmailVerified { get; set; }

    public string PasswordSalt { get; set; }

    public string PasswordHash { get; set; }

    public DateTime LastActive { get; set; }

    public DateTime Registered { get; set; }

    public Role Role { get; set; }
}
