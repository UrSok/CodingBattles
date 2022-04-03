namespace Domain.Entities.Users;

public class Session
{
    public string Token { get; set; }

    public DateTime ExpiresAt { get; set; }
}
