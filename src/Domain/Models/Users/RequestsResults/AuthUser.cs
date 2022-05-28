namespace Domain.Models.Users.RequestsResults;

public class AuthUserRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class AuthUserResult
{
    public string AccessToken { get; set; }
}