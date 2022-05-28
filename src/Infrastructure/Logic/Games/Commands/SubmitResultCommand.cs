using Domain.Entities.Games;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Games;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using MediatR;
using System.Collections.Concurrent;

namespace Infrastructure.Logic.Games.Commands;
internal record SubmitResultCommand(SubmitResultRequest Model) : IRequest<Result>;

internal class SubmitResultCommandValidator : AbstractValidator<SubmitResultCommand>
{
    public SubmitResultCommandValidator()
    {

    }
}

internal class SubmitResultHandler : IRequestHandler<SubmitResultCommand, Result>
{
    private readonly IGameRepository gameRepository;
    private readonly IChallengeRepository challengeRepository;
    private readonly IMediator mediator;

    public SubmitResultHandler(IGameRepository gameRepository, IChallengeRepository challengeRepository, IMediator mediator)
    {
        this.gameRepository = gameRepository;
        this.challengeRepository = challengeRepository;
        this.mediator = mediator;
    }

    public async Task<Result> Handle(SubmitResultCommand request, CancellationToken cancellationToken)
    {
        var game = await this.gameRepository.Get(request.Model.GameId, cancellationToken);
        if (game is null)
        {
            return Result.Failure(ProcessingError.GameNotFound);
        }

        var challenge = await this.challengeRepository.Get(game.CurrentRound.ChallengeId, cancellationToken);
        if (challenge is null)
        {
            return Result.Failure(ProcessingError.ChallengeNotFound);
        }

        var testSummaries = new ConcurrentBag<TestSummary>();

        var parallelismOptions = new ParallelOptions { MaxDegreeOfParallelism = 10 };
        await Parallel.ForEachAsync(challenge.Tests, parallelismOptions, async (test, cancellationToken) =>
        {
            var command = new RunTestCommand(new RunTestRequest
            {
                Language = request.Model.Solution.Language,
                SourceCode = request.Model.Solution.SourceCode,
                Test = test,
            });

            var testResult = await this.mediator.Send(command, cancellationToken);

            var testSummary = new TestSummary()
            {
                TestPair = test,
                Status = TestSummaryStatus.Valid,
            };

            if (testResult.Errors.Any(x => x.Name == ProcessingError.ValidatorNotPassed.Name))
            {
                testSummary.Status = TestSummaryStatus.ValidatorFailed;
                testSummary.Reason = testResult.Value.OutputError;
            }
            else if (testResult.Errors.Any(x => x.Name == ProcessingError.TestNotPassed.Name))
            {
                testSummary.Status = TestSummaryStatus.TestFailed;
                testSummary.Reason = testResult.Value.OutputError;
            }

            testSummaries.Add(testSummary);
        });

        var roundSummary = new RoundSummary()
        {
            UserId = request.Model.UserId,
            Solution = request.Model.Solution,
            TestSummaries = testSummaries.ToList(),
        };

        var result = await this.gameRepository.AddRecordSummary(game.Id, roundSummary, cancellationToken);
        if (!result)
        {
            Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}
