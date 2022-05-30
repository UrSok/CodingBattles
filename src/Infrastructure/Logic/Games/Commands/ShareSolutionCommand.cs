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


internal record ShareSolutionCommand(string GameId, int RoundNumber, string UserId) : IRequest<Result>;

internal class ShareSolutionHandle : IRequestHandler<ShareSolutionCommand, Result>
{
    private readonly IGameRepository gameRepository;

    public ShareSolutionHandle(IGameRepository gameRepository)
    {
        this.gameRepository = gameRepository;
    }

    public async Task<Result> Handle(ShareSolutionCommand request, CancellationToken cancellationToken)
    {
        var game = await this.gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result.Failure(ProcessingError.GameNotFound);
        }

        var roundSummary = game.Rounds
            .First(x => x.Number == request.RoundNumber)?
                .RoundSummaries.First(x => x.UserId == request.UserId);

        roundSummary.SolutionShared = true;

        var result = await this.gameRepository.ShareSolution(game.Id, request.RoundNumber, request.UserId, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}