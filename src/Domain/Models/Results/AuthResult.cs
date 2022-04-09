using Domain.Models.Users;

namespace Domain.Models.Results;

public class AuthResult
{
    public AuthUserModel User { get; set; }
    public string AccessToken { get; set; }
}
