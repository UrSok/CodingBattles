using Application.Managers;
using Domain.Entities.Users;
using Domain.Models.Challenges;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
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

    // TODO: Get + Filtered -> guest+
    // Info From body, can be null
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {

        throw new NotImplementedException();
    }

    // TODO: GetDetails -> guest+
    // id from rom route
    [AllowAnonymous]
    [HttpGet("{challengeId}")]
    public async Task<IActionResult> GetById(CancellationToken cancellationToken)
    {

        throw new NotImplementedException();
    }

    // TODO: Save + Status -> member(only if created by them), admin
    // Save -> member(only if created by them), admin(partial)
    // Should Combine SaveDraft and Save?
    // From body, id can be null if it is an insert
    [Authorize]
    [HttpPost("save/{challengeId?}")]
    public async Task<IActionResult> Save([FromRoute] string? challengeId, [FromBody] ChallengeSaveModel challengeSaveModel, CancellationToken cancellationToken)
    {
        var response = await this.challengeManager.Save(this.JwtToken, challengeId, challengeSaveModel, cancellationToken);
        return this.Process(response);
    }

    [Authorize]
    [HttpPost("saveAndPublish/{challengeId}")]
    public async Task<IActionResult> SaveAndPublish([FromRoute] string challengeId, [FromBody] ChallengeRequestSaveModel challengeRequestSaveModel, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
        //var response = await this.challengeManager.Save(challengeRequestSaveModel, cancellationToken); // TODO: Update
        //return this.Process(response);
    }

    [Authorize(Roles = Role.Admin)]
    [HttpPost("saveAsAdmin/{challengeId}")]
    public async Task<IActionResult> SaveAsAdmin(ChallengeRequestSaveModel challengeRequestSaveModel, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
