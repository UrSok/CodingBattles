using Application.Managers;
using Domain.Entities.Games;
using Domain.Models.Common;
using Domain.Models.Games;
using Domain.Models.Games.Results;
using Domain.Models.Results;
using Infrastructure.Logic.Games.Commands;
using Infrastructure.Logic.Games.Queries;
using MediatR;

namespace Infrastructure.Managers;

public class GameManager : BaseManager, IGameManager
{
    public GameManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<Result<string>> CreateGame(string userId, bool isPrivate, CancellationToken cancellationToken)
    {
        var command = new CreateGameCommand(userId, isPrivate);
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

    public async Task<Result<GetGameResult>> Get(string gameId, CancellationToken cancellationToken)
    {
        var query = new GetGameQuery(gameId);
        return await this.SendCommand(query, cancellationToken);
    }

    public async Task<Result<int>> StartRound(StartRoundRequest startRoundRequest, CancellationToken cancellationToken)
    {
        var command = new StartRoundCommand(startRoundRequest);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result<List<GetGameListResultItem>>> Get(CancellationToken cancellationToken)
    {
        var query = new GetGamesQuery();
        return await this.SendCommand(query, cancellationToken);
    }

    public async Task<Result<List<GetGameListResultItem>>> GetMyGames(string userId, CancellationToken cancellationToken)
    {
        var query = new GetMyGamesQuery(userId);
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
}