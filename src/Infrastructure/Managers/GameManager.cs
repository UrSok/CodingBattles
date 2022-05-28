using Application.Managers;
using Domain.Models.Common.Results;
using Domain.Models.Games;
using Domain.Models.Games.RequestsResults;
using Infrastructure.Logic.Games.Commands;
using Infrastructure.Logic.Games.Queries;
using MediatR;

namespace Infrastructure.Managers;

public class GameManager : BaseManager, IGameManager
{
    public GameManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<Result<string>> CreateGame(string userId, string name, bool isPrivate, CancellationToken cancellationToken)
    {
        var command = new CreateGameCommand(userId, name, isPrivate);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result<string>> JoinGame(string userId, string code, CancellationToken cancellationToken)
    {
        var command = new JoinGameCommand(userId, code);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result<RunTestResult>> RunTest(RunTestRequest model, CancellationToken cancellationToken)
    {
        var command = new RunTestCommand(model);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result<GameDto>> Get(string gameId, CancellationToken cancellationToken)
    {
        var query = new GetGameQuery(gameId);
        return await this.SendCommand(query, cancellationToken);
    }

    public async Task<Result> StartRound(string gameId, CancellationToken cancellationToken)
    {
        var command = new StartRoundCommand(gameId);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result<List<GameSearchItem>>> Get(CancellationToken cancellationToken)
    {
        var query = new GetGamesQuery();
        return await this.SendCommand(query, cancellationToken);
    }

    public async Task<Result<List<GameSearchItem>>> GetGamesByUserId(string userId, CancellationToken cancellationToken)
    {
        var query = new GetGamesByUserIdQuery(userId);
        return await this.SendCommand(query, cancellationToken);
    }

    public async Task<Result> SubmitResult(SubmitResultRequest submitResultRequest, CancellationToken cancellationToken)
    {
        var command = new SubmitResultCommand(submitResultRequest);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result> LeaveGame(string userId, string gameId, CancellationToken cancellationToken)
    {
        var command = new LeaveGameCommand(userId, gameId);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result> SelectChallenge(string gameId, string challengeId, CancellationToken cancellationToken)
    {
        var command = new SelectChallengeCommand(gameId, challengeId);
        return await this.SendCommand(command, cancellationToken);
    }
}