using AutoMapper;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Challenges.Commands;

internal record UnpublishCommand(string ChallengeId, string StatusReason) : IRequest<Result>;

internal class UnpublishCommandCommandValidator : AbstractValidator<UnpublishCommand>
{
    public UnpublishCommandCommandValidator()
    {
        this.RuleFor(x => x.ChallengeId)
            .NotEmpty().WithError(ValidationError.EmptyId);

        this.RuleFor(x => x.StatusReason)
            .NotEmpty().WithError(ValidationError.EmptyStatusReason);
    }
}

internal class UnpublishCommandHandler : IRequestHandler<UnpublishCommand, Result>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IMapper mapper;

    public UnpublishCommandHandler(IChallengeRepository challengeRepository, IMapper mapper)
    {
        this.challengeRepository = challengeRepository;
        this.mapper = mapper;
    }

    public async Task<Result> Handle(UnpublishCommand request, CancellationToken cancellationToken)
    {
        var exitingChallenge = await this.challengeRepository.Get(request.ChallengeId, cancellationToken);
        if (exitingChallenge.Id is null)
        {
            return Result<string>.Failure(ProcessingError.ChallengeNotFound);
        }

        var result = await this.challengeRepository.Unpublish(request.ChallengeId, request.StatusReason, cancellationToken);
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}
