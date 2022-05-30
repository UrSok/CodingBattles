using Domain.Entities.Games;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using Infrastructure.Repositories;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;

internal record SelectChallengeCommand(string GameId, string ChallengeId) : IRequest<Result>;

internal class SelectChallengeHandle : IRequestHandler<SelectChallengeCommand, Result>
{
    private readonly IGameRepository gameRepository;
    private readonly IChallengeRepository challengeRepository;

    public SelectChallengeHandle(IGameRepository gameRepository, IChallengeRepository challengeRepository)
    {
        this.gameRepository = gameRepository;
        this.challengeRepository = challengeRepository;
    }

    public async Task<Result> Handle(SelectChallengeCommand request, CancellationToken cancellationToken)
    {

        var game = await this.gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result.Failure(ProcessingError.GameNotFound);
        }

        var challenge = await this.challengeRepository.Get(request.ChallengeId, cancellationToken);
        if (challenge is null)
        {
            return Result.Failure(ProcessingError.ChallengeNotFound);
        }

        var currentRound = game.Rounds.First();

        currentRound.ChallengeId = challenge.Id;

        var result = await this.gameRepository.UpdateCurrentRound(game.Id, currentRound, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}