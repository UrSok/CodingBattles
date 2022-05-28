using Domain.Entities.Games;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using Infrastructure.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        if (game.CurrentRound is null)
        {
            var lastRoundNumber = game?.PreviousRounds.LastOrDefault()?.Number ?? 0;

            game.CurrentRound = new Round()
            {
                Number = lastRoundNumber + 1
            };
        }
        game.CurrentRound.ChallengeId = challenge.Id;

        var result = await this.gameRepository.UpdateCurrentRound(game.Id, game.CurrentRound, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}