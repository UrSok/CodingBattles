using Domain.Enums;

namespace Domain.Entities.Users;

public class User : BaseEntity
{
    public string Email { get; set; }

    public string Username { get; set; }

    public string PasswordSalt { get; set; }

    public string PasswordHash { get; set; }

    public DateTime Registered { get; set; }

    public string Role { get; set; }

    public Verification Verification { get; set; }

    public List<Session> Sessions { get; set; }
}
