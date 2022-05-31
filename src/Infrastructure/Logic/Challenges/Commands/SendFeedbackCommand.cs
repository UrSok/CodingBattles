using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Challenges.Commands;

internal record SendFeedbackCommand(string ChallengeId, Feedback Feedback, bool OnlyDifficulty = false) : IRequest<Result>;

internal class SendFeedbackCommandValidator : AbstractValidator<SendFeedbackCommand>
{
    public SendFeedbackCommandValidator()
    {
        RuleFor(x => x.ChallengeId)
            .NotEmpty().WithError(ValidationError.EmptyId);
    }
}

internal class SendFeedbackHandler : IRequestHandler<SendFeedbackCommand, Result>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IMapper mapper;

    public SendFeedbackHandler(IChallengeRepository challengeRepository, IMapper mapper)
    {
        this.challengeRepository = challengeRepository;
        this.mapper = mapper;
    }

    public async Task<Result> Handle(SendFeedbackCommand request, CancellationToken cancellationToken)
    {
        var challenge = await challengeRepository.Get(request.ChallengeId, cancellationToken);
        if (challenge.Id is null)
        {
            return Result<string>.Failure(ProcessingError.ChallengeNotFound);
        }

        var feedback = challenge.Feedbacks.FirstOrDefault(x => x.UserId == request.Feedback.UserId);
        if (feedback is not null)
        {
            feedback.Difficulty = request.Feedback.Difficulty;
            var result = await challengeRepository.UpdateFeedback(
                request.ChallengeId,
                request.OnlyDifficulty ? feedback : request.Feedback,
                cancellationToken);

            if (!result)
            {
                return Result.Failure(Error.InternalServerError);
            }
        }
        else
        {
            challenge.Feedbacks.Add(request.Feedback);
            var result = await challengeRepository.AddFeedback(request.ChallengeId, request.Feedback, cancellationToken); 
            if (!result)
            {
                return Result.Failure(Error.InternalServerError);
            }
        }

        var newDifficulty = challenge.Feedbacks.Average(x => x.Difficulty);
        var resultUpdateDifficulty = await challengeRepository.UpdateDificulty(request.ChallengeId, newDifficulty, cancellationToken);
        if (!resultUpdateDifficulty)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}