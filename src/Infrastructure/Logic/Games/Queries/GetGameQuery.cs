using Application.Managers;
using AutoMapper;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Games.Results;
using Domain.Models.Results;
using Domain.Models.Users;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Queries;
internal record GetGameQuery(string GameId) : IRequest<Result<GameDetails>>;

internal class GetGameQueryValidator : AbstractValidator<GetGameQuery>
{
    public GetGameQueryValidator()
    {
        this.RuleFor(x => x.GameId)
            .NotEmpty().WithError(ValidationError.EmptyId);
    }
}

internal class GetGameHandler : IRequestHandler<GetGameQuery, Result<GameDetails>>
{
    private readonly IGameRepository gameRepository;
    private readonly IUserRepository userRepository;
    private readonly IChallengeRepository challengeRepository;
    private readonly IMapper mapper;

    public GetGameHandler(IGameRepository gameRepository, IUserRepository userRepository, IChallengeRepository challengeRepository, IMapper mapper)
    {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
        this.mapper = mapper;
    }

    public async Task<Result<GameDetails>> Handle(GetGameQuery request, CancellationToken cancellationToken)
    {
        var game = await this.gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result<GameDetails>.Failure(ProcessingError.GameNotFound);
        }

        var userIds = game.UserIds;
        userIds.Add(game.GameMasterUserId);
        userIds.AddRange(game.PreviousRounds.SelectMany(x => x.RoundSummaries.Select(y => y.UserId)));

        if (game.CurrentRound is not null)
        {
            userIds.AddRange(game.CurrentRound.RoundSummaries.Select(y => y.UserId));
        }

        var users = await this.userRepository.GetByIds(userIds.Distinct(), cancellationToken);

        var challengeIds = game.PreviousRounds.Select(x => x.ChallengeId).ToList();
        
        if (game.CurrentRound is not null)
        {
            challengeIds.Add(game.CurrentRound.ChallengeId);
        }

        var challenges = await this.challengeRepository.GetByIds(challengeIds, cancellationToken);

        var userModels = this.mapper.Map<IEnumerable<UserModel>>(users);

        var gameDetails = this.mapper.Map<GameDetails>(game);

        gameDetails.GameMasterUser = userModels.First(x => x.Id == game.GameMasterUserId);
        gameDetails.Users = userModels.Where(x => game.UserIds.Contains(x.Id)).ToList();

        foreach (var previousRoundDetails in gameDetails.PreviousRounds)
        {
            var round = game.PreviousRounds.First(x => x.Number == previousRoundDetails.Number);
            previousRoundDetails.Challenge = challenges.First(x => x.Id == round.ChallengeId);

            for (int i = 0; i < previousRoundDetails.RoundSummaries.Count; i++)
            {
                previousRoundDetails.RoundSummaries[0].User = userModels.First(x => x.Id == round.RoundSummaries[i].UserId);
            }
        }

        if (gameDetails.CurrentRound is not null)
        {
            gameDetails.CurrentRound.Challenge = challenges.FirstOrDefault(x => x.Id == game.CurrentRound.ChallengeId);

            for (int i = 0; i < gameDetails.CurrentRound.RoundSummaries.Count; i++)
            {
                gameDetails.CurrentRound.RoundSummaries[0].User = userModels.First(x => x.Id == game.CurrentRound.RoundSummaries[i].UserId);
            }
        }

        return Result<GameDetails>.Success(gameDetails);
    }
}
