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
internal record GetGameQuery(string GameId) : IRequest<Result<GetGameResult>>;

internal class GetGameQueryValidator : AbstractValidator<GetGameQuery>
{
    public GetGameQueryValidator()
    {
        this.RuleFor(x => x.GameId)
            .NotEmpty().WithError(ValidationError.EmptyId);
    }
}

internal class GetGameHandler : IRequestHandler<GetGameQuery, Result<GetGameResult>>
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

    public async Task<Result<GetGameResult>> Handle(GetGameQuery request, CancellationToken cancellationToken)
    {
        var game = await this.gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result<GetGameResult>.Failure(ProcessingError.GameNotFound);
        }

        var rounds = game.Rounds.SelectMany(x => x.RoundSummaries.Select(y => y.UserId));
        var userIds = game.UserIds;
        userIds.Add(game.CreatedByUserId);
        userIds.AddRange(game.Rounds.SelectMany(x => x.RoundSummaries.Select(y => y.UserId)));

        var users = await this.userRepository.GetByIds(userIds, cancellationToken);
        var challenges = await this.challengeRepository.GetByIds(game.Rounds.Select(x => x.ChallengeId), cancellationToken);
        var userModels = this.mapper.Map<IEnumerable<UserModel>>(users);

        var gameResult = this.mapper.Map<GetGameResult>(game);

        gameResult.CreatedByUser = userModels.First(x => x.Id == game.CreatedByUserId);
        gameResult.Users = userModels.Where(x => game.UserIds.Contains(x.Id)).ToList();

        foreach (var gameResultRound in gameResult.Rounds)
        {
            var round = game.Rounds.First(x => x.Number == gameResultRound.Number);
            gameResultRound.Challenge = challenges.First(x => x.Id == round.ChallengeId);

            for (int i = 0; i < gameResultRound.RoundSummaries.Count; i++)
            {
                gameResultRound.RoundSummaries[0].User = userModels.First(x => x.Id == round.RoundSummaries[i].UserId);
            }
        }

        return Result<GetGameResult>.Success(gameResult);
    }
}
