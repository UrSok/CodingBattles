using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Enums.Errors;
using Domain.Models.Challenges;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Challenges.Commands;

internal record SaveChallengeCommand(string JwtToken, string ChallengeId, ChallengeSaveModel Model) : IRequest<Result<string>>;

internal class SaveChallengeCommandValidator : AbstractValidator<SaveChallengeCommand>
{
    public SaveChallengeCommandValidator()
    {
        this.RuleFor(x => x.JwtToken)
            .NotEmpty().WithError(ValidationError.EmptyJwtToken);

        this.RuleFor(x => x.Model.Name)
            .NotEmpty().WithError(ValidationError.EmptyChallengeName);
    }
}

internal class SaveChallengeHandler : IRequestHandler<SaveChallengeCommand, Result<string>>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;

    public SaveChallengeHandler(
        IChallengeRepository challengeRepository,
        IUserRepository userRepository,
        IMapper mapper)
    {
        this.challengeRepository = challengeRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public async Task<Result<string>> Handle(SaveChallengeCommand request, CancellationToken cancellationToken)
    {
        var challenge = this.mapper.Map<Challenge>(request.Model);
        challenge.Id = request.ChallengeId;

        var user = await this.userRepository.GetByJwtToken(request.JwtToken, cancellationToken);
        if (user is null)
        {
            return Result<string>.Failure(ProcessingError.UserNotFound);
        }

        challenge.LastModifiedOn = DateTime.Now;

        if (string.IsNullOrWhiteSpace(request.ChallengeId))
        {
            challenge.CreatedByUserId = user.Id;
            var challengeId = await this.challengeRepository.Create(challenge, cancellationToken);
            return Result<string>.Success(challengeId);
        }

        var existingChallenge = await this.challengeRepository.Get(request.ChallengeId, cancellationToken);
        if (existingChallenge.Id is null)
        {
            return Result<string>.Failure(ProcessingError.ChallengeNotFound);
        }

        if (existingChallenge.CreatedByUserId != user.Id)
        {
            return Result<string>.Failure(ProcessingError.CannotEditForeignRecord);
        }

        var result = await this.challengeRepository.Update(challenge, cancellationToken);
        if (!result)
        {
            return Result<string>.Failure(Error.InternalServerError);
        }

        return Result<string>.Success(existingChallenge.Id);
    }
}