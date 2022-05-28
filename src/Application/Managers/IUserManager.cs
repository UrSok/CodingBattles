using Domain.Models.Common.Results;
using Domain.Models.Users.RequestsResults;

namespace Application.Managers;

public interface IUserManager
{
    Task<Result> Register(RegisterUserRequest registerUserRequest, CancellationToken cancellationToken);
    Task<Result> Activate(string userId, string verificationCode, CancellationToken cancellationToken);
    Task<Result> ResendActivation(string userId, CancellationToken cancellationToken);
    Task<Result<AuthUserResult>> Authenticate(AuthUserRequest authUserRequest, CancellationToken cancellationToken);
    Task<Result> IsUniqueEmail(string email, CancellationToken cancellationToken);
}
