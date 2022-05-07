using Ardalis.GuardClauses;
using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Enums.Errors;
using Domain.Models.Challenges;
using Domain.Models.Common;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Challenges.Queries;

internal record GetChallengeQuery(string Id) : IRequest<Result<Challenge>>;

internal class GetChallengeQueryValidator : AbstractValidator<GetChallengeQuery>
{
    public GetChallengeQueryValidator()
    {
        this.RuleFor(x => x.Id)
            .NotEmpty().WithError(ValidationError.EmptyId);
    }
}

internal class GetChallengeHandler : IRequestHandler<GetChallengeQuery, Result<Challenge>>
{
    private readonly IChallengeRepository challengeRepository;

    public GetChallengeHandler(IChallengeRepository challengeRepository)
    {
        this.challengeRepository = challengeRepository;
    }

    public async Task<Result<Challenge>> Handle(GetChallengeQuery request, CancellationToken cancellationToken)
    {
        var challenge = await this.challengeRepository.Get(request.Id, cancellationToken);

        if (challenge is null)
        {
            Result<Challenge>.Failure(ProcessingError.ChallengeNotFound);
        }

        return Result<Challenge>.Success(challenge);
    }
}
