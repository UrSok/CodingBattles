using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;
using StubGenerator;
using StubGenerator.StubInput.Models.Validation;

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
    private readonly IValidator<Challenge> validator;
    private readonly IChallengeRepository challengeRepository;
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;

    public PublishChallengeHandler(
        IValidator<Challenge> validator,
        IChallengeRepository challengeRepository,
        IUserRepository userRepository,
        IMapper mapper)
    {
        this.validator = validator;
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

        var challengesValidationFailures = this.validator.Validate(challenge)
            .Errors.Where(x => x is not null);

        if (challengesValidationFailures.Any())
        {
            var validationErrors = new List<Error>();

            foreach (var failure in challengesValidationFailures)
            {
                ValidationError.TryFromName(failure.ErrorCode, out Error validationError);
                validationError ??= ValidationError.UnspecifiedError;
                validationErrors.Add(validationError);
            }

            return Result<PublishChallengeResult>.Failure(validationErrors);
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
}

internal class ChallengeValidator : AbstractValidator<Challenge>
{
    public ChallengeValidator()
    {
        this.RuleFor(x => x.Name)
            .NotEmpty().WithError(ValidationError.EmptyChallengeName);

        this.RuleFor(x => x.Task)
            .NotEmpty().WithError(ValidationError.EmptyChallengeTask);

        this.RuleFor(x => x.InputDescription)
            .NotEmpty().WithError(ValidationError.EmptyInputDescription);

        this.RuleFor(x => x.OutputDescription)
            .NotEmpty().WithError(ValidationError.EmptyChallengeOutputDescription);

        this.RuleFor(x => x.Constraints)
            .NotEmpty().WithError(ValidationError.EmptyChallengeConstraints);

        this.RuleFor(x => x.StubGeneratorInput)
            .NotEmpty().WithError(ValidationError.EmptyStubGeneratorInput);

        this.RuleFor(x => x.Tests.Count)
            .GreaterThanOrEqualTo(4).WithError(ValidationError.EmptyChallengeTask);

        this.RuleFor(x => x.Tests)
            .ForEach(x => x.Must(this.ValidateTest).WithError(ValidationError.BadChallengeTest))
            .WithError(ValidationError.BadChallengeTests);

        this.RuleFor(x => x.Solution.SourceCode)
            .NotEmpty().WithError(ValidationError.BadChallengeSolution);

    }

    private bool ValidateTest(TestPair testPair)
    {
        if (string.IsNullOrWhiteSpace(testPair.Title))
        {
            return false;
        }

        if (string.IsNullOrWhiteSpace(testPair.Case.Input) 
            || string.IsNullOrWhiteSpace(testPair.Case.ExpectedOutput))
        {
            return false;
        }

        if (string.IsNullOrWhiteSpace(testPair.Validator.Input)
            || string.IsNullOrWhiteSpace(testPair.Validator.ExpectedOutput))
        {
            return false;
        }

        return true;
    }
}