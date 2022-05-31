using Application.Managers;
using Domain.Entities.Common;
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

    [HttpGet("{gameId}")]
    public async Task<IActionResult> Get([FromRoute] string gameId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.Get(gameId, cancellationToken);
        return this.Process(result);
    }

    [HttpGet("gamesByUser/{userId}")]
    public async Task<IActionResult> GetGamesByUserId([FromRoute] string userId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.GetGamesByUserId(userId, cancellationToken);
        return this.Process(result);
    }

    [HttpPost("createGame/{userId}/{name}/{isPrivate}")]
    public async Task<IActionResult> CreateGame([FromRoute] string userId, [FromRoute] string name, [FromRoute] bool isPrivate, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.CreateGame(userId, name,isPrivate, cancellationToken);
        return this.Process(result);
    }

    [HttpPost("joinGame/{userId}/{code}")]
    public async Task<IActionResult> JoinGame([FromRoute] string userId, [FromRoute] string Code, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.JoinGame(userId, Code, cancellationToken);
        return this.Process(result);
    }

    [HttpPost("leaveGame/{userId}/{gameId}")]
    public async Task<IActionResult> LeaveGame([FromRoute] string userId, [FromRoute] string gameId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.LeaveGame(userId, gameId, cancellationToken);
        return this.Process(result);
    }

    [HttpPost("{gameId}/currentRound/create")]
    public async Task<IActionResult> CreateRound([FromRoute] string gameId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.CreateRound(gameId, cancellationToken);
        return this.Process(result);
    }

    [HttpPost("{gameId}/currentRound/update/settings")]
    public async Task<IActionResult> UpdateCurrentRoundSettings([FromRoute] string gameId, [FromBody] UpdateCurrentRoundSettingsRequest updateCurrentRoundSettings, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.UpdateCurrentRoundSettings(gameId, updateCurrentRoundSettings, cancellationToken);
        return this.Process(result);
    }

    [HttpPost("{gameId}/currentRound/start")]
    public async Task<IActionResult> StartRound([FromRoute] string gameId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.StartRound(gameId, cancellationToken);
        return this.Process(result);
    }

    [HttpPost("{gameId}/currentRound/end")]
    public async Task<IActionResult> EndRound([FromRoute] string gameId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.EndRound(gameId, cancellationToken);
        return this.Process(result);
    }

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

    [HttpPost("{gameId}/{roundNumber}/{userId}/shareSolution")]
    public async Task<IActionResult> ShareSolution([FromRoute] string gameId, [FromRoute] int roundNumber, [FromRoute] string userId, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.ShareSolution(gameId, roundNumber, userId,cancellationToken);
        return this.Process(result);
    }

    [HttpPost("{gameId}/{userId}/saveSolution")]
    public async Task<IActionResult> SaveSolution([FromRoute] string gameId, [FromRoute] string userId, [FromBody] Solution solution, CancellationToken cancellationToken)
    {
        var result = await this.gameManager.SaveSolution(gameId, userId, solution, cancellationToken);
        return this.Process(result);
    }
}
