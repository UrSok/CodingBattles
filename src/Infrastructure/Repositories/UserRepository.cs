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
    Task<User> GetByJwtToken(string jwtToken, CancellationToken cancellationToken);
    Task<User> Get(string id, CancellationToken cancellationToken);
    Task<bool> ActivateUser(string userId, string role, CancellationToken cancellationToken);
    Task<IEnumerable<User>> GetByIds(List<string> userIds, CancellationToken cancellationToken);
}

internal class UserRepository : BaseRepository, IUserRepository
{
    private readonly IMongoCollection<UserDocument> users;

    public UserRepository(IMongoDbContext mongoDbContext, IMapper mapper) : base(mapper)
    {
        this.users = mongoDbContext.Users;
    }

    public async Task<User> Get(string id, CancellationToken cancellationToken)
    {
        var user = (await this.users
            .FindAsync(x => x.Id == id, cancellationToken: cancellationToken))
            .FirstOrDefault(cancellationToken);

        return this.mapper.Map<User>(user);
    }

    public async Task<User> GetByJwtToken(string jwtToken, CancellationToken cancellationToken)
    {
        var user = (await this.users
            .FindAsync(x =>
                x.Sessions.Any(session => session.Token == jwtToken && session.ExpiresAt > DateTime.Now),
                cancellationToken: cancellationToken))
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

        await this.users.InsertOneAsync(userDocument, cancellationToken: cancellationToken);
        return userDocument.Id;
    }

    public async Task<bool> CreateVerification(string userId, Verification verification, CancellationToken cancellationToken)
    {
        var verificationDocument = this.mapper.Map<VerificationDocument>(verification);

        var filter = Builders<UserDocument>.Filter.Eq(x => x.Id, userId);
        var update = Builders<UserDocument>.Update
            .Set(x => x.Verification, verificationDocument);

        var result = await this.users.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }

    public async Task<bool> ActivateUser(string userId, string role, CancellationToken cancellationToken)
    {
        var filter = Builders<UserDocument>.Filter.Eq(x => x.Id, userId);
        var update = Builders<UserDocument>.Update
            .Unset(x => x.Verification)
            .Set(x => x.Role, role);

        var result = await this.users.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }

    public async Task<bool> AddSession(string userId, Session session, CancellationToken cancellationToken)
    {
        var sessionDocument = this.mapper.Map<SessionDocument>(session);

        var filter = Builders<UserDocument>.Filter.Eq(x => x.Id, userId);
        var update = Builders<UserDocument>.Update
            .AddToSet(x => x.Sessions, sessionDocument);

        var result = await this.users.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }

    public async Task<IEnumerable<User>> GetByIds(List<string> userIds, CancellationToken cancellationToken)
    {
        var filter = Builders<UserDocument>.Filter.In(x => x.Id, userIds);
        var userDocuments = (await this.users.FindAsync(filter, cancellationToken: cancellationToken))
            .ToEnumerable(cancellationToken: cancellationToken);
        return this.mapper.Map<IEnumerable<User>>(userDocuments);
    }
}
