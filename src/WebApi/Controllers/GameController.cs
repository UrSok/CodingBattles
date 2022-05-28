using Application.Managers;
using Domain.Models.Games.RequestsResults;
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

    [HttpGet("gamesByUser/{userId}")]
    public async Task<IActionResult> GetGamesByUserId([FromRoute] string userId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.GetGamesByUserId(userId, cancellationToken);
        return this.Process(result);
    }

    // create game

    [HttpPost("createGame/{userId}/{name}/{isPrivate}")]
    public async Task<IActionResult> CreateGame([FromRoute] string userId, [FromRoute] string name, [FromRoute] bool isPrivate, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.CreateGame(userId, name,isPrivate, cancellationToken);
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

    [HttpPost("{gameId}/startRound")]
    public async Task<IActionResult> StartRound([FromRoute] string gameId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.StartRound(gameId, cancellationToken);
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


    [HttpPost("{gameId}/selectChallenge/{challengeId}")]
    public async Task<IActionResult> SelectChallenge([FromRoute] string gameId, [FromRoute] string challengeId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.SelectChallenge(gameId, challengeId, cancellationToken);
        return this.Process(result);
    }
}
