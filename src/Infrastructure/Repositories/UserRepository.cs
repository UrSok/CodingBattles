using AutoMapper;
using Domain.Entities.Users;
using Domain.Repositories;
using Infrastructure.DbDocuments.Users;
using Infrastructure.Persistence;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<UserDocument> _users;
    private readonly IMapper _mapper;

    public UserRepository(IMongoDbContext mongoDbContext, IMapper mapper)
    {
        _users = mongoDbContext.Users;
        _mapper = mapper;
    }

    public async Task<List<User>> GetAll()
    {
        var userDocuments = await _users.FindAsync(_ => true);

        return _mapper.Map<List<User>>(userDocuments.ToList());
    }

    public async Task<Guid> Insert(User user)
    {
        var userDocument = _mapper.Map<UserDocument>(user);
        await _users.InsertOneAsync(userDocument);
        return userDocument.Id;
    }
}
