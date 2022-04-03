using Domain.Entities.Users;
using Domain.Models.Users;

namespace Domain.Models.Responses;

public class AuthResponse
{
    public AuthUserModel User { get; set; }
    public string AccessToken { get; set; }
}
