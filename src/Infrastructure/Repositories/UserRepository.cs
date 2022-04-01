using AutoMapper;
using Domain.Entities.Users;
using Domain.Repositories;
using Infrastructure.DbDocuments.Users;
using Infrastructure.Persistence;
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

    public async Task<User> GetByEmail(string email, CancellationToken cancellationToken)
    {
        var projection = Builders<UserDocument>
            .Projection
            .Exclude(x => x.HashIterations);
        var options = new FindOptions<UserDocument, UserDocument> { Projection = projection };

        var users = await this.users
            .FindAsync(user => user.Email == email, options, cancellationToken);

        return mapper.Map<User>(users.FirstOrDefault(cancellationToken));    
    }

    public async Task<Guid> Insert(User user, CancellationToken cancellationToken)
    {
        var userDocument = this.mapper.Map<UserDocument>(user);
        await this.users.InsertOneAsync(userDocument, cancellationToken: cancellationToken);
        return userDocument.Id;
    }
}
