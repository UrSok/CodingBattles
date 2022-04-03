using Domain.Entities.Users;

namespace Domain.Repositories;

public interface IUserRepository
{
    Task<string> Create(User user, CancellationToken cancellationToken);
    Task<bool> CreateVerification(string userId, Verification verification, CancellationToken cancellationToken);
    Task<User> GetByEmail(string email, CancellationToken cancellationToken);
    Task<bool> AddSession(string userId, Session session, CancellationToken cancellationToken);
    Task<User> Get(string id, CancellationToken cancellationToken);
    Task<bool> ActivateUser(string userId, string role, CancellationToken cancellationToken);
}
