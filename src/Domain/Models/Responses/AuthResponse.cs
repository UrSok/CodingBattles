using Domain.Entities.Users;

namespace Domain.Models.Responses;

public class AuthResponse
{
    public User User { get; set; } //TODO: Probably should use a UserViewModel instead?
    public string Token { get; set; }
}
