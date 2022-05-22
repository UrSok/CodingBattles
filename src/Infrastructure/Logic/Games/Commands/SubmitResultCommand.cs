using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Games;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;
internal record SubmitResultCommand(SubmitResultRequest Model) : IRequest<Result>;

internal class SubmitResultCommandValidator : AbstractValidator<SubmitResultCommand>
{
    public SubmitResultCommandValidator()
    {

    }
}

internal class SubmitResultHandler : IRequestHandler<SubmitResultCommand, Result>
{
    private readonly IGameRepository gameRepository;

    public SubmitResultHandler(IGameRepository gameRepository)
    {
        this.gameRepository = gameRepository;
    }

    public async Task<Result> Handle(SubmitResultCommand request, CancellationToken cancellationToken)
    {
        var game = await this.gameRepository.Get(request.Model.GameId, cancellationToken);
        if (game is null)
        {
            return Result.Failure(ProcessingError.GameNotFound);
        }

        game.PreviousRounds[request.Model.RoundNumber].RoundSummaries.Add(request.Model.RoundSummary);

        var result = await this.gameRepository.AddRecordSummary(game.Id, request.Model.RoundNumber, request.Model.RoundSummary, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}
