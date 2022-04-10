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

internal record SaveAsAdminChallengeCommand(string ChallengeId, ChallengeSaveModel Model) : IRequest<Result>;

internal class SaveAsAdminChallengeCommandValidator : AbstractValidator<SaveAsAdminChallengeCommand>
{
    public SaveAsAdminChallengeCommandValidator()
    {
        this.RuleFor(x => x.ChallengeId)
            .NotEmpty().WithError(ValidationError.EmptyId);

        this.RuleFor(x => x.Model.Name)
            .NotEmpty().WithError(ValidationError.EmptyChallengeName);
    }
}

internal class SaveAsAdminChallengeHandler : IRequestHandler<SaveAsAdminChallengeCommand, Result>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IMapper mapper;

    public SaveAsAdminChallengeHandler(IChallengeRepository challengeRepository, IMapper mapper)
    {
        this.challengeRepository = challengeRepository;
        this.mapper = mapper;
    }

    public async Task<Result> Handle(SaveAsAdminChallengeCommand request, CancellationToken cancellationToken)
    {
        var challenge = this.mapper.Map<Challenge>(request.Model);
        challenge.Id = request.ChallengeId;

        var exitingChallenge = await this.challengeRepository.Get(request.ChallengeId, cancellationToken);
        if (exitingChallenge.Id is null)
        {
            return Result<string>.Failure(ProcessingError.ChallengeNotFound);
        }

        challenge.LastModifiedOn = DateTime.Now;

         var result = await this.challengeRepository.Update(challenge, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}
