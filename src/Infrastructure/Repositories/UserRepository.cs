using AutoMapper;
using Domain.Entities.Users;
using Infrastructure.DbDocuments.Users;
using Infrastructure.Persistence;
using MongoDB.Driver;

namespace Infrastructure.Repositories;
internal interface IUserRepository
{
    Task<string> Create(User user, CancellationToken cancellationToken);
    Task<bool> CreateVerification(string userId, Verification verification, CancellationToken cancellationToken);
    Task<User> GetByEmail(string email, CancellationToken cancellationToken);
    Task<bool> AddSession(string userId, Session session, CancellationToken cancellationToken);
    Task<User> Get(string id, CancellationToken cancellationToken);
    Task<bool> ActivateUser(string userId, string role, CancellationToken cancellationToken);
}

internal class UserRepository : IUserRepository
{
    private readonly IMongoCollection<UserDocument> users;
    private readonly IMapper mapper;

    public UserRepository(IMongoDbContext mongoDbContext, IMapper mapper)
    {
        this.users = mongoDbContext.Users;
        this.mapper = mapper;
    }

    public async Task<User> Get(string id, CancellationToken cancellationToken)
    {
        var user = (await this.users
            .FindAsync(x => x.Id == id, cancellationToken: cancellationToken))
            .FirstOrDefault(cancellationToken);

        return this.mapper.Map<User>(user);
    }

    public async Task<User> GetByEmail(string email, CancellationToken cancellationToken)
    {
        var user = (await this.users
            .FindAsync(x => x.Email == email, cancellationToken: cancellationToken))
            .FirstOrDefault(cancellationToken);

        return this.mapper.Map<User>(user);
    }

    public async Task<string> Create(User user, CancellationToken cancellationToken)
    {
        var userDocument = this.mapper.Map<UserDocument>(user);
        //userDocument.Verification.Id = ObjectId.GenerateNewId().ToString();

        await this.users.InsertOneAsync(userDocument, cancellationToken: cancellationToken);
        return userDocument.Id;
    }

    public async Task<bool> CreateVerification(string userId, Verification verification, CancellationToken cancellationToken)
    {
        var verificationDocument = this.mapper.Map<VerificationDocument>(verification);
        //verificationDocument.Id = ObjectId.GenerateNewId().ToString();

        var filter = Builders<UserDocument>.Filter.Eq(x => x.Id, userId);
        var updateDefinition = Builders<UserDocument>.Update
            .Set(x => x.Verification, verificationDocument);

        var result = await this.users.UpdateOneAsync(filter, updateDefinition, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }

    public async Task<bool> ActivateUser(string userId, string role, CancellationToken cancellationToken)
    {
        var filter = Builders<UserDocument>.Filter.Eq(x => x.Id, userId);
        var updateDefinition = Builders<UserDocument>.Update
            .Unset(x => x.Verification)
            .Set(x => x.Role, role);

        var result = await this.users.UpdateOneAsync(filter, updateDefinition, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }

    public async Task<bool> AddSession(string userId, Session session, CancellationToken cancellationToken)
    {
        var sessionDocument = this.mapper.Map<SessionDocument>(session);
        //sessionDocument.Id = ObjectId.GenerateNewId().ToString();

        var filter = Builders<UserDocument>.Filter.Eq(x => x.Id, userId);
        var updateDefinition = Builders<UserDocument>.Update
            .AddToSet(x => x.Sessions, sessionDocument);

        var result = await this.users.UpdateOneAsync(filter, updateDefinition, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }
}
