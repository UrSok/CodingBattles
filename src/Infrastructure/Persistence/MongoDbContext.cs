using Infrastructure.DbDocuments.Common;
using Infrastructure.DbDocuments.Games;
using Infrastructure.DbDocuments.ProgrammingProblems;
using Infrastructure.DbDocuments.Users;
using Infrastructure.Options;
using MongoDB.Driver;

namespace Infrastructure.Persistence;

public interface IMongoDbContext
{
    IMongoCollection<GameDocument> Games { get; }
    IMongoCollection<ProgrammingProblemDocument> ProgrammingProblems { get; }
    IMongoCollection<UserDocument> Users { get; }
    IMongoCollection<MailTemplateDocument> MailTemplates { get; }
}

public class MongoDbContext : IMongoDbContext
{
    public MongoDbContext(IMongoClient client, IMongoDbOptions settings)
    {
        var db = client.GetDatabase(settings.DatabaseName);

        Users = db.GetCollection<UserDocument>("Users");
        ProgrammingProblems = db.GetCollection<ProgrammingProblemDocument>("ProgrammingProblems");
        Games = db.GetCollection<GameDocument>("Games");
        MailTemplates = db.GetCollection<MailTemplateDocument>("MailTemplates");
    }

    public IMongoCollection<UserDocument> Users { get; }
    public IMongoCollection<ProgrammingProblemDocument> ProgrammingProblems { get; }
    public IMongoCollection<GameDocument> Games { get; }
    public IMongoCollection<MailTemplateDocument> MailTemplates { get; }
}
