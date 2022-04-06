using Domain.Enums;

namespace Domain.Entities.Users;

public class Verification
{
    public string Code { get; set; }

    public VerificationType Type { get; set; }

    public DateTime ExpiresAt { get; set; }
}
