using Ardalis.GuardClauses;
using AutoMapper;
using Domain.Enums.Errors;
using Domain.Models.Challenges;
using Domain.Models.Challenges.RequestsResults;
using Domain.Models.Common;
using Domain.Models.Common.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Challenges.Queries;

internal record GetChallengesQuery(ChallengeSearchRequest Model) : IRequest<Result<Paginated<ChallengeSearchItem>>>;

internal class GetChallengesQueryValidator : AbstractValidator<GetChallengesQuery>
{
    public GetChallengesQueryValidator()
    {
        this.RuleFor(x => x.Model)
            .Must(this.ValidateMinMaxDifficulty).WithError(ValidationError.MinimumDifficultyIsBiggerThanMaximumDifficulty);
    }

    private bool ValidateMinMaxDifficulty(ChallengeSearchRequest model)
    {
        if (model.HasBothDifficultiesSet && model.MinimumDifficulty > model.MaximumDifficulty)
        {
            return false;
        }

        return true;
    }
}

internal class GetChallengesHandler : IRequestHandler<GetChallengesQuery, Result<Paginated<ChallengeSearchItem>>>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly ITagRepository tagRepository;
    private readonly IMapper mapper;

    public GetChallengesHandler(IChallengeRepository challengeRepository, ITagRepository tagRepository, IMapper mapper)
    {
        this.challengeRepository = challengeRepository;
        this.tagRepository = tagRepository;
        this.mapper = mapper;
    }

    public async Task<Result<Paginated<ChallengeSearchItem>>> Handle(GetChallengesQuery request, CancellationToken cancellationToken)
    {
        var (totalPages, totalItems, challenges) =
            await this.challengeRepository.GetPublished(request.Model, cancellationToken);
        
        var tags = await this.tagRepository.GetAll(cancellationToken);
        var challengeSearchItems = challenges.Select((challenge) =>
        {
            var challengesSearchItem = this.mapper.Map<ChallengeSearchItem>(challenge);
            challengesSearchItem.Tags = tags.Where(x => challenge.TagIds.Contains(x.Id)).ToList();
            return challengesSearchItem;
        });

        var paginatedModel = new Paginated<ChallengeSearchItem>
        {
            TotalPages = totalPages,
            TotalItems = totalItems,
            Items = challengeSearchItems
        };

        return Result<Paginated<ChallengeSearchItem>>.Success(paginatedModel);
    }
}
