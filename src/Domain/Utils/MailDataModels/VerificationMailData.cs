namespace Domain.Utils.MailDataModels;

public class VerificationMailData
{
    public string UserId { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string VerificationCode { get; set; }
}
