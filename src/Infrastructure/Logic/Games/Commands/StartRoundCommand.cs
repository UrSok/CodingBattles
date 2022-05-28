using Domain.Entities.Games;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Common.Results;
using Domain.Models.Games;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;
internal record StartRoundCommand(string GameId) : IRequest<Result>;

internal class StartRoundCommandValidator : AbstractValidator<StartRoundCommand>
{
    public StartRoundCommandValidator()
    {
        this.RuleFor(x => x.GameId)
            .NotEmpty().WithError(ValidationError.EmptyGameId);
    }
}

internal class StartRoundHandler : IRequestHandler<StartRoundCommand, Result>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IGameRepository gameRepository;

    public StartRoundHandler(IChallengeRepository challengeRepository, IGameRepository gameRepository)
    {
        this.challengeRepository = challengeRepository;
        this.gameRepository = gameRepository;
    }

    public async Task<Result> Handle(StartRoundCommand request, CancellationToken cancellationToken)
    {
        var game = await this.gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result.Failure(ProcessingError.GameNotFound);
        }

        game.CurrentRound.StartTime = DateTime.Now;
        game.CurrentRound.DurationMinutes = 30;

        var result = await this.gameRepository.UpdateCurrentRound(game.Id, game.CurrentRound, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        game.Status = GameStatus.InProgress;
        result = await this.gameRepository.UpdateGameStatus(game.Id, GameStatus.InProgress, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}
