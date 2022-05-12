using Application.Managers;
using Domain.Models.Games;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace WebApi.Controllers;

[Authorize]
[Route("api/v1/[controller]")]
[ApiController]
public class GameController : BaseController
{
    private readonly IGameManager gameManager;

    public GameController(IGameManager gamesManager)
    {
        this.gameManager = gamesManager;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var result = await this.gameManager.Get(cancellationToken);
        return this.Process(result);
    }

    // pooling game status

    [HttpGet("{gameId}")]
    public async Task<IActionResult> Get([FromRoute] string gameId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.Get(gameId, cancellationToken);
        return this.Process(result);
    }
    // pooling game status

    [HttpGet("my/{userId}")]
    public async Task<IActionResult> GetMyGames([FromRoute] string userId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.GetMyGames(userId, cancellationToken);
        return this.Process(result);
    }

    // create game

    [HttpPost("createGame/{userId}/{isPrivate}")]
    public async Task<IActionResult> CreateGame([FromRoute] string userId, [FromRoute] bool isPrivate, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.CreateGame(userId, isPrivate, cancellationToken);
        return this.Process(result);
    }

    // join game

    [HttpPost("joinGame/{userId}/{code}")]
    public async Task<IActionResult> JoinGame([FromRoute] string userId, [FromRoute] string Code, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.JoinGame(userId, Code, cancellationToken);
        return this.Process(result);
    }

    // leave game

    [HttpPost("leaveGame/{userId}/{gameId}")]
    public async Task<IActionResult> LeaveGame([FromRoute] string userId, [FromRoute] string gameId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.LeaveGame(userId, gameId, cancellationToken);
        return this.Process(result);
    }

    // start round

    [HttpPost("startRound")]
    public async Task<IActionResult> StartRound([FromBody] StartRoundRequest startRoundRequest, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.StartRound(startRoundRequest, cancellationToken);
        return this.Process(result);
    }

    // submit result

    [HttpPost("submitResult")]
    public async Task<IActionResult> SubmitResult([FromBody] SubmitResultRequest submitResultRequest, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.SubmitResult(submitResultRequest, cancellationToken);
        return this.Process(result);
    }


    [HttpPost("runTest")]
    public async Task<IActionResult> RunTest([FromBody] RunTestRequest runTestModel, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.RunTest(runTestModel, cancellationToken);
        return this.Process(result);
    }
}
