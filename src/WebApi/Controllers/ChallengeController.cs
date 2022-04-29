using Application.Managers;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Models.Challenges;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Constants;

namespace WebApi.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class ChallengeController : BaseController
{
    private readonly IChallengeManager challengeManager;

    public ChallengeController(IChallengeManager challengeManager)
    {
        this.challengeManager = challengeManager;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Get([FromBody] ChallengeSearchModel challengeSearchModel, CancellationToken cancellationToken)
    {
        var result = await this.challengeManager.Get(challengeSearchModel, cancellationToken);
        return this.Process(result);
    }

    // TODO: GetDetails -> guest+
    // id from rom route
    [Authorize(Roles = AuthorizeConsts.All)]
    [HttpGet("{challengeId}")]
    public async Task<IActionResult> GetDetails(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    [Authorize(Roles = AuthorizeConsts.MemberOrAdmin)]
    [HttpPost("save/{challengeId?}")]
    public async Task<IActionResult> Save([FromBody] ChallengeSaveModel challengeSaveModel, [FromRoute] string? challengeId = null, CancellationToken cancellationToken = default)
    {
        var result = await this.challengeManager.Save(JwtToken, challengeId, challengeSaveModel, cancellationToken);
        return this.Process(result);
    }

    [Authorize(Roles = AuthorizeConsts.MemberOrAdmin)]
    [HttpPost("publish/{challengeId}")]
    public async Task<IActionResult> Publish([FromRoute] string challengeId, CancellationToken cancellationToken)
    {
        var response = await this.challengeManager.Publish(JwtToken, challengeId, cancellationToken);
        return this.Process(response);
    }

    [Authorize(Roles = Role.Admin)]
    [HttpPost("saveAsAdmin/{challengeId}")]
    public async Task<IActionResult> SaveAsAdmin([FromRoute] string challengeId, [FromBody] ChallengeSaveModel challengeSaveModel, CancellationToken cancellationToken)
    {
        var result = await this.challengeManager.SaveAsAdmin(challengeId, challengeSaveModel, cancellationToken); // TODO: Add status reason
        return this.Process(result);
    }
}
