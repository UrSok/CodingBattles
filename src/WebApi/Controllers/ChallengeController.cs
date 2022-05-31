using Application.Managers;
using Domain.Entities.Challenges;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Models.Challenges.RequestsResults;
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
    public async Task<IActionResult> Get([FromBody] ChallengeSearchRequest challengeSearchRequest, CancellationToken cancellationToken)
    {
        var result = await this.challengeManager.Get(challengeSearchRequest, cancellationToken);
        return this.Process(result);
    }


    [AllowAnonymous]
    [HttpGet("{challengeId}")]
    public async Task<IActionResult> Get([FromRoute] string challengeId, CancellationToken cancellationToken)
    {
        var result = await this.challengeManager.Get(challengeId, cancellationToken);
        return this.Process(result);
    }

    [Authorize(Roles = AuthorizeConsts.MemberOrAdmin)]
    [HttpPost("save/{challengeId?}")]
    public async Task<IActionResult> Save([FromBody] ChallengeSaveRequest challengeSaveRequest, [FromRoute] string? challengeId = null, CancellationToken cancellationToken = default)
    {
        var result = await this.challengeManager.Save(JwtToken, challengeId, challengeSaveRequest, cancellationToken);
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
    [HttpPost("unpublish/{challengeId}/{statusReason}")]
    public async Task<IActionResult> SaveAsAdmin([FromRoute] string challengeId, [FromRoute] string statusReason, CancellationToken cancellationToken)
    {
        var result = await this.challengeManager.Unpublish(challengeId, statusReason, cancellationToken);
        return this.Process(result);
    }

    [Authorize(Roles = AuthorizeConsts.MemberOrAdmin)]
    [HttpPost("sendFeedback/{challengeId}")]
    public async Task<IActionResult> SendFeedback([FromRoute] string challengeId, [FromBody] Feedback feedback, CancellationToken cancellationToken)
    {
        var response = await this.challengeManager.SendFeedback(challengeId, feedback, cancellationToken);
        return this.Process(response);
    }
}
