using AutoMapper;
using Domain.Entities.Games;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Challenges;
using Domain.Models.Common.Results;
using Domain.Models.Games;
using Domain.Models.Users;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Queries;
internal record GetGameQuery(string GameId) : IRequest<Result<GameDto>>;

internal class GetGameQueryValidator : AbstractValidator<GetGameQuery>
{
    public GetGameQueryValidator()
    {
        RuleFor(x => x.GameId)
            .NotEmpty().WithError(ValidationError.EmptyId);
    }
}

internal class GetGameHandler : IRequestHandler<GetGameQuery, Result<GameDto>>
{
    private readonly IGameRepository gameRepository;
    private readonly IUserRepository userRepository;
    private readonly IChallengeRepository challengeRepository;
    private readonly ITagRepository tagRepository;
    private readonly IMapper mapper;

    private IEnumerable<UserDto> userDtos;
    private IEnumerable<ChallengeDto> challengeDtos;

    public GetGameHandler(IGameRepository gameRepository,
                          IUserRepository userRepository,
                          IChallengeRepository challengeRepository,
                          ITagRepository tagRepository,
                          IMapper mapper)
    {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
        this.tagRepository = tagRepository;
        this.mapper = mapper;
    }

    public async Task<Result<GameDto>> Handle(GetGameQuery request, CancellationToken cancellationToken)
    {
        var game = await gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result<GameDto>.Failure(ProcessingError.GameNotFound);
        }

        var userIds = game.UserIds;
        userIds.Add(game.GameMasterUserId);
        userIds.AddRange(game.Rounds.SelectMany(x => x.RoundSummaries.Select(y => y.UserId)));

        var users = await userRepository.GetByIds(userIds.Distinct(), cancellationToken);

        var challengeIds = game.Rounds.Select(x => x.ChallengeId).ToList();

        var tags = await tagRepository.GetAll(cancellationToken);
        userDtos = mapper.Map<IEnumerable<UserDto>>(users);

        var challenges = await challengeRepository.GetByIds(challengeIds, cancellationToken);
        challengeDtos = challenges.Select((challenge) =>
        {
            var challengeDto = mapper.Map<ChallengeDto>(challenge);
            challengeDto.Tags = tags.Where(x => challenge.TagIds.Contains(x.Id)).ToList();
            challengeDto.User = userDtos.First(x => x.Id == challenge.CreatedByUserId);
            return challengeDto;
        });

        var gameDto = mapper.Map<GameDto>(game);

        gameDto.GameMasterUser = userDtos.First(x => x.Id == game.GameMasterUserId);
        gameDto.Users = userDtos.Where(x => game.UserIds.Contains(x.Id)).ToList();

        var roundDtos = game.Rounds.Select(MapRound).ToList();
        gameDto.CurrentRound = roundDtos.FirstOrDefault(x => x.Status is RoundStatus.NotStarted or RoundStatus.InProgress);
        gameDto.PreviousRounds = roundDtos.Where(x => x.Status is RoundStatus.Finished).ToList();

        return Result<GameDto>.Success(gameDto);
    }

    private RoundDto MapRound(Round round)
    {
        var roundDto = mapper.Map<RoundDto>(round);
        roundDto.Challenge = challengeDtos.FirstOrDefault(x => x.Id == round.ChallengeId);

        roundDto.RoundSummaries = round.RoundSummaries.Select((roundSummary) =>
        {
            var roundSummaryDto = mapper.Map<RoundSummaryDto>(roundSummary);
            roundSummaryDto.User = userDtos.First(x => x.Id == roundSummary.UserId);
            return roundSummaryDto;
        }).OrderByDescending(x => x?.Score ?? 0).ThenBy(x => x?.TimePassed ?? 0).ToList();

        return roundDto;
    }
}
