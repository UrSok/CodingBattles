using AutoMapper;
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

internal record GetChallengesByUserIdQuery(string UserId) : IRequest<Result<List<ChallengeSearchItem>>>;

internal class GetChallengesByUserIdQueryValidator : AbstractValidator<GetChallengesByUserIdQuery>
{
    public GetChallengesByUserIdQueryValidator()
    {
        this.RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationError.EmptyUserId);
    }
}

internal class GetChallengesByUserIdHandler : IRequestHandler<GetChallengesByUserIdQuery, Result<List<ChallengeSearchItem>>>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly ITagRepository tagRepository;
    private readonly IMapper mapper;

    public GetChallengesByUserIdHandler(IChallengeRepository challengeRepository, ITagRepository tagRepository, IMapper mapper)
    {
        this.challengeRepository = challengeRepository;
        this.tagRepository = tagRepository;
        this.mapper = mapper;
    }

    public async Task<Result<List<ChallengeSearchItem>>> Handle(GetChallengesByUserIdQuery request, CancellationToken cancellationToken)
    {
        var challenges = await this.challengeRepository.GetByUserId(request.UserId, cancellationToken);

        var tags = await this.tagRepository.GetAll(cancellationToken);
        var challengeSearchItems = challenges.Select((challenge) =>
        {
            var challengesSearchItem = this.mapper.Map<ChallengeSearchItem>(challenge);
            challengesSearchItem.Tags = tags.Where(x => challenge.TagIds.Contains(x.Id)).ToList();
            return challengesSearchItem;
        }).ToList();

        return Result<List<ChallengeSearchItem>>.Success(challengeSearchItems);
    }
}
