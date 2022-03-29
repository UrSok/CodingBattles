using Domain.Repositories;
using Infrastructure.DbDocuments.Games;
using Infrastructure.Persistence;

namespace Infrastructure.Repositories;
public abstract class BaseRepository : IBaseRepository
{
    private readonly IMongoDbContext _db;

    public BaseRepository(IMongoDbContext db)
    {
        _db = db;
    }


}
