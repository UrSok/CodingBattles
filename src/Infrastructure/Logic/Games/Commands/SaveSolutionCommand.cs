using Domain.Entities.Common;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;

internal record SaveSolutionCommand(string GameId, string UserId, Solution Solution) : IRequest<Result>;

internal class SaveSolutionCommandValidator : AbstractValidator<SaveSolutionCommand>
{
    public SaveSolutionCommandValidator()
    {
        RuleFor(x => x.GameId)
            .NotEmpty().WithError(ValidationError.EmptyGameId);
    }
}

internal class SaveSolutionHandler : IRequestHandler<SaveSolutionCommand, Result>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IGameRepository gameRepository;
    private readonly IMediator mediator;

    public SaveSolutionHandler(IChallengeRepository challengeRepository, IGameRepository gameRepository, IMediator mediator)
    {
        this.challengeRepository = challengeRepository;
        this.gameRepository = gameRepository;
        this.mediator = mediator;
    }

    public async Task<Result> Handle(SaveSolutionCommand request, CancellationToken cancellationToken)
    {
        var game = await gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result.Failure(ProcessingError.GameNotFound);
        }

        var currentRound = game.Rounds.First();
        var roundSummary = currentRound.RoundSummaries.First(x => x.UserId == request.UserId);
        roundSummary.Solution = request.Solution;

        var result = await gameRepository.ReplaceSummaryRecord(game.Id, roundSummary, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}
