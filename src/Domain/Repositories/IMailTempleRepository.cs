using Domain.Entities.Common;
using Domain.Enums;

namespace Domain.Repositories;

public interface IMailTempleRepository
{
    Task<MailTemplate> GetTemplateByCode(MailTemplateCode mailTemplateCode, CancellationToken cancellationToken);
    Task InsertTemplatesIfDontExist(IEnumerable<MailTemplate> mailTemplates, CancellationToken cancellationToken = default);
}
