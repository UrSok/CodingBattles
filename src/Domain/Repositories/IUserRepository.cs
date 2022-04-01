using Domain.Entities.Users;

namespace Domain.Repositories;

public interface IUserRepository
{
    Task<Guid> Insert(User user, CancellationToken cancellationToken);
    Task<User> GetByEmail(string email, CancellationToken cancellationToken);
}
