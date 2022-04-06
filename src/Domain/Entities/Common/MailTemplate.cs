using Domain.Enums;

namespace Domain.Entities.Common;

public class MailTemplate
{
    public MailTemplateCode TemplateCode { get; set; }

    public string Subject { get; set; }

    public string Body { get; set; }
}
