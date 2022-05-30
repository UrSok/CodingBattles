using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using Domain.Models.Games.RequestsResults;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Logic.Games.Commands;

internal record UpdateCurrentRoundSettingsCommand(string GameId, UpdateCurrentRoundSettingsRequest Model) : IRequest<Result>;

internal class UpdateCurrentRoundSettingsCommandValidator : AbstractValidator<UpdateCurrentRoundSettingsCommand>
{
    public UpdateCurrentRoundSettingsCommandValidator()
    {
        RuleFor(x => x.GameId)
            .NotEmpty().WithError(ValidationError.EmptyGameId);
    }
}

internal class UpdateCurrentRoundSettingsHandler : IRequestHandler<UpdateCurrentRoundSettingsCommand, Result>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IGameRepository gameRepository;

    public UpdateCurrentRoundSettingsHandler(IChallengeRepository challengeRepository, IGameRepository gameRepository)
    {
        this.challengeRepository = challengeRepository;
        this.gameRepository = gameRepository;
    }

    public async Task<Result> Handle(UpdateCurrentRoundSettingsCommand request, CancellationToken cancellationToken)
    {
        var game = await gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result.Failure(ProcessingError.GameNotFound);
        }

        var round = game.Rounds.First();
        round.GameMode = request.Model.GameMode;
        round.RestrictedLanguages = request.Model.RestrictedLanguages;

        if (round.ChallengeSelectorType != request.Model.ChallengeSelectorType)
        {
            round.ChallengeId = null;
            round.ChallengeSelectorType = request.Model.ChallengeSelectorType;
            if (round.ChallengeSelectorType == ChallengeSelectorType.Random.Name
                || round.ChallengeSelectorType == ChallengeSelectorType.RandomNotPassed.Name)
            {
                round.ChallengeId = await this.challengeRepository.GetRandomId(cancellationToken);
            }
        }

        var result = await gameRepository.UpdateCurrentRound(game.Id, round, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}