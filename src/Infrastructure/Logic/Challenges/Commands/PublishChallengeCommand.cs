using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;
using StubGenerator;

namespace Infrastructure.Logic.Challenges.Commands;
internal record PublishChallengeCommand(string JwtToken, string ChallengeId) : IRequest<Result<PublishChallengeResult>>;

internal class PublishChallengeCommandValidator : AbstractValidator<PublishChallengeCommand>
{
    public PublishChallengeCommandValidator()
    {
        this.RuleFor(x => x.JwtToken)
            .NotEmpty().WithError(ValidationError.EmptyJwtToken);

        this.RuleFor(x => x.ChallengeId)
            .NotEmpty().WithError(ValidationError.EmptyId);
    }
}

internal class PublishChallengeHandler : IRequestHandler<PublishChallengeCommand, Result<PublishChallengeResult>>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;

    public PublishChallengeHandler(
        IChallengeRepository challengeRepository,
        IUserRepository userRepository,
        IMapper mapper)
    {
        this.challengeRepository = challengeRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public async Task<Result<PublishChallengeResult>> Handle(PublishChallengeCommand request, CancellationToken cancellationToken)
    {

        var user = await this.userRepository.GetByJwtToken(request.JwtToken, cancellationToken);
        if (user is null)
        {
            return Result<PublishChallengeResult>.Failure(ProcessingError.UserNotFound);
        }

        var challenge = await this.challengeRepository.Get(request.ChallengeId, cancellationToken);
        if (challenge is null)
        {
            return Result<PublishChallengeResult>.Failure(ProcessingError.ChallengeNotFound);
        }

        if (challenge.CreatedByUserId != user.Id)
        {
            return Result<PublishChallengeResult>.Failure(ProcessingError.CannotEditForeignRecord);
        }

        var validationResult = this.Validate(challenge);
        if (!validationResult.IsSuccess)
        {
            return Result<PublishChallengeResult>.Failure(validationResult.Errors);
        }

        var stubInputError = StubGeneratorEntry.Validate(challenge.StubGeneratorInput);
        if (stubInputError is not null)
        {
            var publishChangllengeResult = new PublishChallengeResult()
            {
                ChallengeId = challenge.Id,
                Error = this.mapper.Map<StubGeneratorError>(stubInputError),
            };
            return Result<PublishChallengeResult>.Failure(publishChangllengeResult, ProcessingError.StubInputError);
        }

        //TODO: Run TESTS

        challenge.Status = ChallengeStatus.Published;
        challenge.LastModifiedOn = DateTime.Now;

        var result = await this.challengeRepository.Publish(challenge, cancellationToken);
        if (!result)
        {
            return Result<PublishChallengeResult>.Failure(Error.InternalServerError);
        }

        return Result<PublishChallengeResult>.Success(new PublishChallengeResult { ChallengeId = challenge.Id });
    }

    private Result Validate(Challenge challenge)
    {
        if (string.IsNullOrWhiteSpace(challenge.Name))
        {
            return Result.Failure(ValidationError.EmptyChallengeName);
        }

        if (string.IsNullOrWhiteSpace(challenge.Task))
        {
            return Result.Failure(ValidationError.NotEnoughChallengeTask);
        }

        if (string.IsNullOrWhiteSpace(challenge.InputDescription))
        {
            return Result.Failure(ValidationError.EmptyInputDescription);
        }

        if (string.IsNullOrWhiteSpace(challenge.OutputDescription))
        {
            return Result.Failure(ValidationError.EmptyChallengeOutputDescription);
        }

        if (string.IsNullOrWhiteSpace(challenge.Constraints))
        {
            return Result.Failure(ValidationError.EmptyChallengeConstraints);
        }

        if (string.IsNullOrWhiteSpace(challenge.StubGeneratorInput))
        {
            return Result.Failure(ValidationError.EmptyStubGeneratorInput);
        }

        if (challenge.Tests?.Count < 4)
        {
            return Result.Failure(ValidationError.NotEnoughChallengeTask);
        }

        foreach (var testPair in challenge.Tests)
        {
            if (string.IsNullOrWhiteSpace(testPair.Title)
                || string.IsNullOrWhiteSpace(testPair.Case?.Input)
                || string.IsNullOrWhiteSpace(testPair.Case?.ExpectedOutput)
                || string.IsNullOrWhiteSpace(testPair.Validator?.Input)
                || string.IsNullOrWhiteSpace(testPair.Validator?.ExpectedOutput))
            {
                return Result.Failure(ValidationError.BadChallengeTest);
            }
        }

        if (string.IsNullOrWhiteSpace(challenge.Solution?.SourceCode))
        {
            return Result.Failure(ValidationError.BadChallengeSolution);
        }

        return Result.Success();
    }
}