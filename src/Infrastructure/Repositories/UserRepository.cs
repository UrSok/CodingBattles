using AutoMapper;
using Domain.Entities.Users;
using Domain.Repositories;
using Infrastructure.DbDocuments.Users;
using Infrastructure.Persistence;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<UserDocument> users;
    private readonly IMapper mapper;

    public UserRepository(IMongoDbContext mongoDbContext, IMapper mapper)
    {
        this.users = mongoDbContext.Users;
        this.mapper = mapper;
    }

    public async Task<bool> CreateVerification(string userId, Verification verification, CancellationToken cancellationToken)
    {
        var verificationDocument = this.mapper.Map<VerificationDocument>(verification);
        verificationDocument.Id = ObjectId.GenerateNewId().ToString();

        var filter = Builders<UserDocument>.Filter.Eq(x => x.Id, userId);
        var updateDefinition = Builders<UserDocument>.Update
            .Set(x => x.Verification, verificationDocument);

        var result = await this.users.UpdateOneAsync(filter, updateDefinition, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }

    public async Task<User> GetByEmail(string email, CancellationToken cancellationToken)
    {
        var users = await this.users
            .FindAsync(user => user.Email == email, cancellationToken: cancellationToken);

        return this.mapper.Map<User>(users.FirstOrDefault(cancellationToken));    
    }

    public async Task<string> Create(User user, CancellationToken cancellationToken)
    {
        var userDocument = this.mapper.Map<UserDocument>(user);
        userDocument.Id = ObjectId.GenerateNewId().ToString();

        await this.users.InsertOneAsync(userDocument, cancellationToken: cancellationToken);
        return userDocument.Id;
    }
}
