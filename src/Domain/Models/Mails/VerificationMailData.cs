namespace Domain.Models.Mails;

public class VerificationMailDto
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string VerificationCode { get; set; }
    public object VerificationUrl { get; set; }
}
