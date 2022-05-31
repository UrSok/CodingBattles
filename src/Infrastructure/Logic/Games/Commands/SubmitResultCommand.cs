using Domain.Entities.Common;
using Domain.Entities.Games;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using Domain.Models.Games.RequestsResults;
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

        var currentRound = game.Rounds.First();

        var challenge = await this.challengeRepository.Get(currentRound.ChallengeId, cancellationToken);
        if (challenge is null)
        {
            return Result.Failure(ProcessingError.ChallengeNotFound);
        }

        var submittedAt = DateTime.Now;

        var roundSummary = new RoundSummary()
        {
            Status = RoundSummaryStatus.Submitting,
            UserId = request.Model.UserId,
            TimePassed = Convert.ToInt32((submittedAt.Ticks - currentRound.StartTime.Value.Ticks) / 10000),
            Solution = request.Model.Solution,
        };

        var replaceRecordSummaryResult = await this.gameRepository.ReplaceSummaryRecord(game.Id, roundSummary, cancellationToken);
        if (!replaceRecordSummaryResult)
        {
            Result.Failure(Error.InternalServerError);
        }

        var testSummariesAndIndexes = new ConcurrentBag<(TestSummary, int)>();

        var parallelismOptions = new ParallelOptions { MaxDegreeOfParallelism = 10 };
        await Parallel.ForEachAsync(challenge.Tests.Select((test, index) => (test, index)), parallelismOptions, async (testAndIndex, cancellationToken) =>
        {
            var command = new RunTestCommand(new RunTestRequest
            {
                Solution = new Solution()
                {
                    Language = request.Model.Solution?.Language,
                    SourceCode = request.Model.Solution?.SourceCode,
                },             
                Test = testAndIndex.test,
            });

            var testResult = await this.mediator.Send(command, cancellationToken);

            var testSummary = new TestSummary()
            {
                TestPair = testAndIndex.test,
                Status = TestSummaryStatus.Valid,
            };

            if (testResult.Errors.Any(x => x.Name == ProcessingError.BuildError.Name))
            {
                testSummary.Status = TestSummaryStatus.BuildError;
                testSummary.Reason = testResult.Value.OutputError;
            }
            else if (testResult.Errors.Any(x => x.Name == ProcessingError.ValidatorNotPassed.Name))
            {
                testSummary.Status = TestSummaryStatus.ValidatorFailed;
                testSummary.Reason = testResult.Value.OutputError;
            }
            else if (testResult.Errors.Any(x => x.Name == ProcessingError.TestNotPassed.Name))
            {
                testSummary.Status = TestSummaryStatus.TestFailed;
                testSummary.Reason = testResult.Value.OutputError;
            }

            testSummariesAndIndexes.Add((testSummary, testAndIndex.index));
        });

        var testSummaries = testSummariesAndIndexes.OrderBy(x => x.Item2).Select(x => x.Item1);

        var validTestsCount = testSummaries.Count(x => x.Status == TestSummaryStatus.Valid);

        roundSummary.Status = RoundSummaryStatus.Submitted;
        roundSummary.Score = validTestsCount > 0 ? (testSummariesAndIndexes.Count * 100 / validTestsCount) : 0;
        roundSummary.TestSummaries = testSummaries.ToList();

        var isSubmitted = await this.gameRepository.ReplaceSummaryRecord(game.Id, roundSummary, cancellationToken);
        if (!isSubmitted)
        {
            Result.Failure(Error.InternalServerError);
        }

        if (!currentRound.RoundSummaries.Any(x => x.Status is RoundSummaryStatus.NotSubmitted && x.UserId != request.Model.UserId))
        {
            var command = new EndRoundCommand(game.Id, true);
            await this.mediator.Send(command);
        }

        return Result.Success();
    }
}
