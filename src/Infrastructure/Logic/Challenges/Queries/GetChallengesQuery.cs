using Ardalis.GuardClauses;
using AutoMapper;
using Domain.Enums.Errors;
using Domain.Models.Challenges;
using Domain.Models.Common;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Challenges.Queries;

internal record GetChallengesQuery(ChallengeSearchModel ChallengeSearchModel) : IRequest<Result<PaginatedModel<ChallengeSearchResultItem>>>;

internal class GetChallengesQueryValidator : AbstractValidator<GetChallengesQuery>
{
    public GetChallengesQueryValidator()
    {
        this.RuleFor(x => x.ChallengeSearchModel)
            .Must(this.ValidateMinMaxDifficulty).WithError(ValidationError.MinimumDifficultyIsBiggerThanMaximumDifficulty);
    }

    private bool ValidateMinMaxDifficulty(ChallengeSearchModel model)
    {
        if (model.HasBothDifficultiesSet && model.MinimumDifficulty > model.MaximumDifficulty)
        {
            return false;
        }

        return true;
    }
}

internal class GetChallengesHandler : IRequestHandler<GetChallengesQuery, Result<PaginatedModel<ChallengeSearchResultItem>>>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IMapper mapper;

    public GetChallengesHandler(IChallengeRepository challengeRepository, IMapper mapper)
    {
        this.challengeRepository = challengeRepository;
        this.mapper = mapper;
    }

    public async Task<Result<PaginatedModel<ChallengeSearchResultItem>>> Handle(GetChallengesQuery request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));

        var (totalPages, totalItems, challenges) = 
            await this.challengeRepository.Get(request.ChallengeSearchModel, cancellationToken);

        var paginatedModel = new PaginatedModel<ChallengeSearchResultItem>
        {
            TotalPages = totalPages,
            TotalItems = totalItems,
            Items = this.mapper.Map<IEnumerable<ChallengeSearchResultItem>>(challenges)
        };



        return Result<PaginatedModel<ChallengeSearchResultItem>>.Success(paginatedModel);
    }
}
