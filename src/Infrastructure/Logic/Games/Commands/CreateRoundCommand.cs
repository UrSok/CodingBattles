using Domain.Entities.Games;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;

internal record CreateRoundCommand(string GameId) : IRequest<Result>;

internal class CreateRoundCommandValidator : AbstractValidator<CreateRoundCommand>
{
    public CreateRoundCommandValidator()
    {
        RuleFor(x => x.GameId)
            .NotEmpty().WithError(ValidationError.EmptyGameId);
    }
}

internal class CreateRoundHandler : IRequestHandler<CreateRoundCommand, Result>
{
    private readonly IGameRepository gameRepository;

    public CreateRoundHandler(IGameRepository gameRepository)
    {
        this.gameRepository = gameRepository;
    }

    public async Task<Result> Handle(CreateRoundCommand request, CancellationToken cancellationToken)
    {
        var game = await gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result.Failure(ProcessingError.GameNotFound);
        }

        var newRound = new Round
        {
            Number = game.Rounds.Count > 0 ? game.Rounds.Count + 1 : 1,
            DurationMinutes = 20,
            Status = RoundStatus.NotStarted,
            GameMode = GameMode.Classic.Name,
            ChallengeSelectorType = ChallengeSelectorType.Specific.Name,
            RestrictedLanguages = new List<string>(),
        };

        var result = await gameRepository.CreateCurrentRound(game.Id, newRound, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}
