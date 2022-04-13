using Domain.Models.Results;
using Domain.Models.Users;

namespace Application.Managers;

public interface IUserManager
{
    Task<Result> Register(UserRegistrationModel userRegistrationModel, CancellationToken cancellationToken);
    Task<Result> Activate(string userId, string verificationCode, CancellationToken cancellationToken);
    Task<Result> ResendActivation(string userId, CancellationToken cancellationToken);
    Task<Result<AuthResult>> Authenticate(UserLoginModel userLoginModel, CancellationToken cancellationToken);
    Task<Result<AuthUserModel>> GetAuthUserByJwtToken(string jwtToken, CancellationToken cancellationToken);
}
