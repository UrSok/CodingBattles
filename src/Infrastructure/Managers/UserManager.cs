using Application.Managers;
using Domain.Models.Results;
using Domain.Models.Users;
using Infrastructure.Logic.Users.Commands;
using Infrastructure.Logic.Users.Queries;
using MediatR;

namespace Infrastructure.Managers;

public class UserManager : BaseManager, IUserManager
{
    public UserManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<Result> Register(UserRegistrationModel userRegistrationModel, CancellationToken cancellationToken)
    {
        var command = new RegisterUserCommand(userRegistrationModel);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result> Activate(string userId, string verificationCode, CancellationToken cancellationToken)
    {
        var command = new ActivateUserCommand(userId, verificationCode);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result> ResendActivation(string userId, CancellationToken cancellationToken)
    {
        var command = new ResendUserActivationCommand(userId);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result<AuthResult>> Authenticate(UserLoginModel userLoginModel, CancellationToken cancellationToken)
    {
        var command = new AuthUserCommand(userLoginModel);
        return await this.SendCommand(command, cancellationToken);

    }

    public async Task<Result<AuthUserModel>> GetAuthUserByJwtToken(string jwtToken, CancellationToken cancellationToken)
    {
        var command = new GetAuthUserByJwtTokenQuery(jwtToken);
        return await this.SendCommand(command, cancellationToken);
    }
}
