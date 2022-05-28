using Ardalis.GuardClauses;
using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Enums.Errors;
using Domain.Models.Challenges;
using Domain.Models.Common;
using Domain.Models.Common.Results;
using Domain.Models.Users;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Challenges.Queries;

internal record GetChallengeQuery(string Id) : IRequest<Result<ChallengeDto>>;

internal class GetChallengeQueryValidator : AbstractValidator<GetChallengeQuery>
{
    public GetChallengeQueryValidator()
    {
        this.RuleFor(x => x.Id)
            .NotEmpty().WithError(ValidationError.EmptyId);
    }
}

internal class GetChallengeHandler : IRequestHandler<GetChallengeQuery, Result<ChallengeDto>>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly ITagRepository tagRepository;
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;

    public GetChallengeHandler(IChallengeRepository challengeRepository,
                               ITagRepository tagRepository,
                               IUserRepository userRepository,
                               IMapper mapper)
    {
        this.challengeRepository = challengeRepository;
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public async Task<Result<ChallengeDto>> Handle(GetChallengeQuery request, CancellationToken cancellationToken)
    {
        if (!MongoDB.Bson.ObjectId.TryParse(request.Id, out _))
        {
            return Result<ChallengeDto>.Failure(ValidationError.InvalidId);
        }

        var challenge = await this.challengeRepository.Get(request.Id, cancellationToken);
        var challengeDto = this.mapper.Map<ChallengeDto>(challenge);

        if (challenge is null)
        {
            Result<ChallengeDto>.Failure(ProcessingError.ChallengeNotFound);
        }

        var tags = await this.tagRepository.GetByIds(challenge.TagIds, cancellationToken);
        var user = await this.userRepository.Get(challenge.CreatedByUserId, cancellationToken);

        challengeDto.Tags = tags.ToList();
        challengeDto.User = this.mapper.Map<UserDto>(user);

        return Result<ChallengeDto>.Success(challengeDto);
    }
}
