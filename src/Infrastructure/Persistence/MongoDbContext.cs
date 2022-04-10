using Infrastructure.DbDocuments.Challenges;
using Infrastructure.DbDocuments.Common;
using Infrastructure.DbDocuments.Games;
using Infrastructure.DbDocuments.Users;
using Infrastructure.Options;
using MongoDB.Driver;

namespace Infrastructure.Persistence;

internal interface IMongoDbContext
{
    IMongoCollection<GameDocument> Games { get; }
    IMongoCollection<ChallengeDocument> Challenges { get; }
    IMongoCollection<TagDocument> Tags { get; }
    IMongoCollection<UserDocument> Users { get; }
    IMongoCollection<MailTemplateDocument> MailTemplates { get; }
}

internal class MongoDbContext : IMongoDbContext
{
    public MongoDbContext(IMongoDbOptions mongoDbOptions)
    {
        var mongoClient = new MongoClient(mongoDbOptions.ConnectionString/* + "/?uuidRepresentation=standard"*/);

        var db = mongoClient.GetDatabase(mongoDbOptions.DatabaseName);

        Users = db.GetCollection<UserDocument>(nameof(Users));
        Challenges = db.GetCollection<ChallengeDocument>(nameof(Challenges));
        Games = db.GetCollection<GameDocument>(nameof(Games));
        MailTemplates = db.GetCollection<MailTemplateDocument>(nameof(MailTemplates));
        Tags = db.GetCollection<TagDocument>(nameof(Tags));
    }

    public IMongoCollection<UserDocument> Users { get; }
    public IMongoCollection<ChallengeDocument> Challenges { get; }
    public IMongoCollection<TagDocument> Tags { get; }
    public IMongoCollection<GameDocument> Games { get; }
    public IMongoCollection<MailTemplateDocument> MailTemplates { get; }
}
