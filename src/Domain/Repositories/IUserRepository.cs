using Domain.Entities.Users;

namespace Domain.Repositories;

public interface IUserRepository
{
    Task<Guid> Insert(User user);
    Task<List<User>> GetAll();
}
