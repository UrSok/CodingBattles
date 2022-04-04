using AutoMapper;
using Domain.Entities.Common;
using Domain.Enums;
using Infrastructure.DbDocuments.Common;
using Infrastructure.Persistence;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

internal interface IMailTemplateRepository
{
    Task<MailTemplate> GetTemplateByCode(MailTemplateCode mailTemplateCode, CancellationToken cancellationToken);
    Task InsertTemplatesIfDontExist(IEnumerable<MailTemplate> mailTemplates, CancellationToken cancellationToken = default);
}

internal class MailTemplateRepository : IMailTemplateRepository
{
    private readonly IMongoCollection<MailTemplateDocument> mailTemplates;
    private readonly IMapper mapper;

    public MailTemplateRepository(IMongoDbContext mongoDbContext, IMapper mapper)
    {
        this.mailTemplates = mongoDbContext.MailTemplates;
        this.mapper = mapper;
    }

    public async Task<MailTemplate> GetTemplateByCode(MailTemplateCode mailTemplateCode, CancellationToken cancellationToken)
    {
        var mailTemplates = await this.mailTemplates
            .FindAsync(x => x.TemplateCode == mailTemplateCode, cancellationToken: cancellationToken);

        return this.mapper.Map<MailTemplate>(mailTemplates.FirstOrDefault(cancellationToken));
    }

    public async Task InsertTemplatesIfDontExist(IEnumerable<MailTemplate> mailTemplates, CancellationToken cancellationToken = default)
    {
        var mailTemplateDocuments = await this.mailTemplates
            .FindAsync(x => true, cancellationToken: cancellationToken);
        var mailTemplateDocumentList = await mailTemplateDocuments.ToListAsync(cancellationToken: cancellationToken);
        foreach (var mailTemplate in mailTemplates)
        {
            if (!mailTemplateDocumentList.Any(x =>
                x.TemplateCode == mailTemplate.TemplateCode))
            {
                var insertMailTemplateDocument = this.mapper.Map<MailTemplateDocument>(mailTemplate);
                await this.mailTemplates.InsertOneAsync(insertMailTemplateDocument, cancellationToken: cancellationToken);
            }
        }
    }
}
