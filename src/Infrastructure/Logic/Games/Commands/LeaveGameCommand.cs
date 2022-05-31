using Domain.Entities.Users;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Common.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;
internal record LeaveGameCommand(string UserId, string GameId) : IRequest<Result>;

internal class LeaveGameCommandValidator : AbstractValidator<LeaveGameCommand>
{
    public LeaveGameCommandValidator()
    {
        this.RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationError.EmptyUserId);

        this.RuleFor(x => x.GameId)
            .NotEmpty().WithError(ValidationError.EmptyGameId);
    }
}

internal class LeaveGameHandler : IRequestHandler<LeaveGameCommand, Result>
{
    private readonly IGameRepository gameRepository;
    private readonly IUserRepository userRepository;
    private readonly IMediator mediator;

    public LeaveGameHandler(IGameRepository gameRepository, IUserRepository userRepository,  IMediator mediator)
    {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.mediator = mediator;
    }

    public async Task<Result> Handle(LeaveGameCommand request, CancellationToken cancellationToken)
    {
        var game = await this.gameRepository.Get(request.GameId, cancellationToken); 
        if (game is null)
        {
            return Result.Failure(ProcessingError.GameNotFound);
        }

        var result = await this.gameRepository.RemoveFromGame(request.GameId, request.UserId, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        if (game.GameMasterUserId == request.UserId)
        {
            var users = await userRepository.GetByIds(game.UserIds, cancellationToken);
            var firstUser = users.FirstOrDefault(x => x.Role is Role.Member or Role.Admin);
            if (firstUser is null)
            {
                var currentRound = game.Rounds.FirstOrDefault(x => x.Status is not RoundStatus.Finished);
                
                if (currentRound is not null)
                {
                    var command = new EndRoundCommand(game.Id, true);
                    await this.mediator.Send(command, cancellationToken);
                }
                await this.gameRepository.UpdateGameStatus(request.GameId, GameStatus.Finished, cancellationToken);
                return Result.Success();
            }

            var result2 = await this.gameRepository.MakeGameMaster(request.GameId, firstUser.Id, cancellationToken);
            if (!result2)
            {
                return Result.Failure(Error.InternalServerError);
            }
        }

        return Result.Success();
    }
}
