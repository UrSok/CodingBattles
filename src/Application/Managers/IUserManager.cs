using Domain.Models.Responses;
using Domain.Models.Users;

namespace Application.Managers;

public interface IUserManager
{
    Task<BaseResponse> Register(UserRegistrationModel userRegistrationModel, CancellationToken cancellationToken);
    Task<BaseResponse> Activate(string userId, string verificationCode, CancellationToken cancellationToken);
    Task<BaseResponse> ResendActivation(string userId, CancellationToken cancellationToken);
    Task<BaseResponse<AuthResponse>> Authenticate(UserLoginModel userLoginModel, CancellationToken cancellationToken);
}
