namespace Domain.Models.Mails;

public class SendMailDto
{
    public string Recipient { get; set; }

    public string Subject { get; set; }

    public string Body { get; set; }
}
