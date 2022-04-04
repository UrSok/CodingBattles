using Application.Managers;
using Domain.Models.Responses;
using Domain.Models.Users;
using Infrastructure.Logic.Users.Commands;
using MediatR;

namespace Infrastructure.Managers;

public class UserManager : BaseManager, IUserManager
{
    public UserManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<BaseResponse> Register(UserRegistrationModel userRegistrationModel, CancellationToken cancellationToken)
    {
        var command = new RegisterUserCommand(userRegistrationModel);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<BaseResponse> Activate(string userId, string verificationCode, CancellationToken cancellationToken)
    {
        var command = new ActivateUserCommand(userId, verificationCode);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<BaseResponse> ResendActivation(string userId, CancellationToken cancellationToken)
    {
        var command = new ResendUserActivationCommand(userId);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<BaseResponse<AuthResponse>> Authenticate(UserLoginModel userLoginModel, CancellationToken cancellationToken)
    {
        var command = new AuthUserCommand(userLoginModel);
        return await this.SendCommand(command, cancellationToken);

    }
}
