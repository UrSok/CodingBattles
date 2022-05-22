using Domain.Entities.Games;
using Domain.Models.Common;
using Domain.Models.Games;
using Domain.Models.Games.Results;
using Domain.Models.Results;

namespace Application.Managers;

public interface IGameManager
{
    Task<Result<RunTestResult>> RunTest(RunTestRequest model, CancellationToken cancellationToken);
    Task<Result<string>> CreateGame(string userId, string name, bool isPrivate, CancellationToken cancellationToken);
    Task<Result<string>> JoinGame(string userId, string code, CancellationToken cancellationToken);
    Task<Result<GameDetails>> Get(string gameId, CancellationToken cancellationToken);
    Task<Result<List<GameSearchItem>>> Get(CancellationToken cancellationToken);
    Task<Result> SubmitResult(SubmitResultRequest submitResultRequest, CancellationToken cancellationToken);
    Task<Result<List<GameSearchItem>>> GetGamesByUserId(string userId, CancellationToken cancellationToken);
    Task<Result> LeaveGame(string userId, string gameId, CancellationToken cancellationToken);

    Task<Result> StartRound(string gameId, CancellationToken cancellationToken);
    Task<Result> SelectChallenge(string gameId, string challengeId, CancellationToken cancellationToken);
}

