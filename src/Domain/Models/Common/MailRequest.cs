namespace Domain.Models.Common;

public class MailRequest
{
    public string Recipient { get; set; }

    public string Subject { get; set; }

    public string Body { get; set; }
}
