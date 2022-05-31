using Domain.Entities.Common;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;

internal record EndRoundCommand(string GameId, bool Forced) : IRequest<Result>;

internal class EndRoundCommandValidator : AbstractValidator<EndRoundCommand>
{
    public EndRoundCommandValidator()
    {
        RuleFor(x => x.GameId)
            .NotEmpty().WithError(ValidationError.EmptyGameId);
    }
}

internal class EndRoundHandler : IRequestHandler<EndRoundCommand, Result>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IGameRepository gameRepository;
    private readonly IMediator mediator;

    public EndRoundHandler(IChallengeRepository challengeRepository, IGameRepository gameRepository, IMediator mediator)
    {
        this.challengeRepository = challengeRepository;
        this.gameRepository = gameRepository;
        this.mediator = mediator;
    }

    public async Task<Result> Handle(EndRoundCommand request, CancellationToken cancellationToken)
    {
        var game = await gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result.Failure(ProcessingError.GameNotFound);
        }

        var currentRound = game.Rounds.First();
        currentRound.Status = RoundStatus.Finished;
        var result = await gameRepository.UpdateCurrentRound(game.Id, currentRound, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        if (request.Forced)
        {
            currentRound.RoundSummaries.Where(x => x.Status
                is RoundSummaryStatus.NotSubmitted).ToList().ForEach(async (roundSummary) =>
                {
                    var command = new SubmitResultCommand(new()
                    {
                        GameId = game.Id,
                        UserId = roundSummary.UserId,
                        Solution = new Solution()
                        {
                            Language = roundSummary.Solution?.Language ?? Language.Javascript.Name,
                            SourceCode = roundSummary.Solution?.SourceCode ?? "",
                        }
                    });

                    var result = await mediator.Send(command);
                });
        }

        result = await gameRepository.UpdateGameStatus(game.Id, GameStatus.NotStarted, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}
