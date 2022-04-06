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
    IMongoCollection<UserDocument> Users { get; }
    IMongoCollection<MailTemplateDocument> MailTemplates { get; }
}

internal class MongoDbContext : IMongoDbContext
{
    public MongoDbContext(IMongoDbOptions mongoDbOptions)
    {
        var mongoClient = new MongoClient(mongoDbOptions.ConnectionString/* + "/?uuidRepresentation=standard"*/);

        var db = mongoClient.GetDatabase(mongoDbOptions.DatabaseName);

        Users = db.GetCollection<UserDocument>("Users");
        Challenges = db.GetCollection<ChallengeDocument>("Challenges");
        Games = db.GetCollection<GameDocument>("Games");
        MailTemplates = db.GetCollection<MailTemplateDocument>("MailTemplates");
    }

    public IMongoCollection<UserDocument> Users { get; }
    public IMongoCollection<ChallengeDocument> Challenges { get; }
    public IMongoCollection<GameDocument> Games { get; }
    public IMongoCollection<MailTemplateDocument> MailTemplates { get; }
}
