using Application.Managers;
using Domain.Models.Games;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Authorize]
[Route("api/v1/[controller]")]
[ApiController]
public class GamesController : BaseController
{
    private readonly IGamesManager gamesManager;

    public GamesController(IGamesManager gamesManager)
    {
        this.gamesManager = gamesManager;
    }

    [HttpPost("runTest")]
    public async Task<IActionResult> RunTest([FromBody] RunTestModel runTestModel, CancellationToken cancellationToken)
    {
        var result = await this.gamesManager.RunTest(runTestModel, cancellationToken);
        return this.Process(result);
    }
}
