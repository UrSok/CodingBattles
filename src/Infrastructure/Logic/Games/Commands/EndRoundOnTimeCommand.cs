using Domain.Entities.Common;
using Domain.Entities.Games;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;

internal record EndRoundOnTimeCommand() : IRequest<int>;

internal class EndRoundOnTimeHandler : IRequestHandler<EndRoundOnTimeCommand, int>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IGameRepository gameRepository;
    private readonly IMediator mediator;

    public EndRoundOnTimeHandler(IChallengeRepository challengeRepository, IGameRepository gameRepository, IMediator mediator)
    {
        this.challengeRepository = challengeRepository;
        this.gameRepository = gameRepository;
        this.mediator = mediator;
    }

    public async Task<int> Handle(EndRoundOnTimeCommand request, CancellationToken cancellationToken)
    {
        var games = await this.gameRepository.GetAllGamesWithRoundsInProgress(cancellationToken);

        var parallelismOptions = new ParallelOptions { MaxDegreeOfParallelism = 10 };
        await Parallel.ForEachAsync(games, parallelismOptions, async (game, cancellationToken) =>
        {
            var currentRounds = game.Rounds.FirstOrDefault(x => x.Status == RoundStatus.InProgress);
            var command = new EndRoundCommand(game.Id, true);
            await this.mediator.Send(command);
        });

        return games.Count;
    }
}
