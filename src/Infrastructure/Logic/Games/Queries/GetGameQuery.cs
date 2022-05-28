using Application.Managers;
using AutoMapper;
using Domain.Entities.Games;
using Domain.Enums.Errors;
using Domain.Models.Challenges;
using Domain.Models.Common;
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
        this.RuleFor(x => x.GameId)
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
        var game = await this.gameRepository.Get(request.GameId, cancellationToken);
        if (game is null)
        {
            return Result<GameDto>.Failure(ProcessingError.GameNotFound);
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

        var tags = await this.tagRepository.GetAll(cancellationToken);
        this.userDtos = this.mapper.Map<IEnumerable<UserDto>>(users);

        var challenges = await this.challengeRepository.GetByIds(challengeIds, cancellationToken);
        this.challengeDtos = challenges.Select((challenge) =>
        {
            var challengeDto = this.mapper.Map<ChallengeDto>(challenge);
            challengeDto.Tags = tags.Where(x => challenge.TagIds.Contains(x.Id)).ToList();
            return challengeDto;
        });


        var gameDto = this.mapper.Map<GameDto>(game);

        gameDto.GameMasterUser = this.userDtos.First(x => x.Id == game.GameMasterUserId);
        gameDto.Users = this.userDtos.Where(x => game.UserIds.Contains(x.Id)).ToList();
        gameDto.PreviousRounds = game.PreviousRounds.Select(this.MapRound).ToList();

        if (game.CurrentRound is not null)
        {
            gameDto.CurrentRound = this.MapRound(game.CurrentRound);
        }

        return Result<GameDto>.Success(gameDto);
    }

    private RoundDto MapRound(Round round)
    {
        var roundDto = this.mapper.Map<RoundDto>(round);
        roundDto.Challenge = this.challengeDtos.FirstOrDefault(x => x.Id == round.ChallengeId);

        roundDto.RoundSummaries = round.RoundSummaries.Select((roundSummary) =>
        {
            var roundSummaryDto = this.mapper.Map<RoundSummaryDto>(roundSummary);
            roundSummaryDto.User = this.userDtos.First(x => x.Id == roundSummary.UserId);
            return roundSummaryDto;
        }).ToList();

        return roundDto;
    }
}
