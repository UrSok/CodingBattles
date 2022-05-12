using Domain.Entities.Games;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Games;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;
internal record StartRoundCommand(StartRoundRequest Model) : IRequest<Result<int>>;

internal class StartRoundCommandValidator : AbstractValidator<StartRoundCommand>
{
    public StartRoundCommandValidator()
    {
        this.RuleFor(x => x.Model.ChallengeId)
            .NotEmpty().WithError(ValidationError.EmptyChallengeId);

        this.RuleFor(x => x.Model.GameId)
            .NotEmpty().WithError(ValidationError.EmptyGameId);
    }
}

internal class StartRoundHandler : IRequestHandler<StartRoundCommand, Result<int>>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IGameRepository gameRepository;

    public StartRoundHandler(IChallengeRepository challengeRepository, IGameRepository gameRepository)
    {
        this.challengeRepository = challengeRepository;
        this.gameRepository = gameRepository;
    }

    public async Task<Result<int>> Handle(StartRoundCommand request, CancellationToken cancellationToken)
    {
        var game = await this.gameRepository.Get(request.Model.GameId, cancellationToken);
        if (game is null)
        {
            return Result<int>.Failure(ProcessingError.GameNotFound);
        }

        var challenge = await this.challengeRepository.Get(request.Model.ChallengeId, cancellationToken);
        if (challenge is null)
        {
            return Result<int>.Failure(ProcessingError.ChallengeNotFound);  
        }

        var lastRound = game.Rounds.LastOrDefault();

        var round = new Round
        {
            Number = lastRound is null ? 1 : lastRound.Number + 1,
            StartTime = DateTime.Now,
            DurationMinutes = 30,
            ChallengeId = challenge.Id,
        };

        var result = await this.gameRepository.StartRound(game.Id, round, cancellationToken);
        if (!result)
        {
            return Result<int>.Failure(Error.InternalServerError);
        }

        return Result<int>.Success(round.Number);
    }
}
