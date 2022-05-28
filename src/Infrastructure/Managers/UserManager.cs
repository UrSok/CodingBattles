using Application.Managers;
using Domain.Models.Common.Results;
using Domain.Models.Users.RequestsResults;
using Infrastructure.Logic.Users.Commands;
using Infrastructure.Logic.Users.Queries;
using MediatR;

namespace Infrastructure.Managers;

public class UserManager : BaseManager, IUserManager
{
    public UserManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<Result> Register(RegisterUserRequest userRegistrationModel, CancellationToken cancellationToken)
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

    public async Task<Result<AuthUserResult>> Authenticate(AuthUserRequest authUserRequest, CancellationToken cancellationToken)
    {
        var command = new AuthUserCommand(authUserRequest);
        return await this.SendCommand(command, cancellationToken);

    }

    public async Task<Result> IsUniqueEmail(string email, CancellationToken cancellationToken)
    {
        var query = new GetIsUniqueUserEmailQuery(email);
        return await this.SendCommand(query, cancellationToken);
    }
}
