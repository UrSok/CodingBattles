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

    /*[AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get(
        int page = 1,
        int pageSize = 20,
        string? sortBy = null,
        OrderStyle orderStyle = OrderStyle.None,
        string? searchTxt = null,
        string[]? tagIds = null,
        int? minimumDifficulty = null,
        int? maximumDifficulty = null,
        CancellationToken cancellationToken = default)
    {
        var challengeSearchModel = new ChallengeSearchModel()
        {
            Page = page,
            PageSize = pageSize,
            SortBy = sortBy,
            OrderStyle = orderStyle,
            SearchTxt = searchTxt,
            TagIds = tagIds,
            MinimumDifficulty = minimumDifficulty,
            MaximumDifficulty = maximumDifficulty
        };
        var result = await this.challengeManager.Get(challengeSearchModel, cancellationToken);
        return this.Process(result);
    }*/

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Get(ChallengeSearchModel challengeSearchModel, CancellationToken cancellationToken)
    {
        var result = await this.challengeManager.Get(challengeSearchModel, cancellationToken);
        return this.Process(result);
    }

    // TODO: GetDetails -> guest+
    // id from rom route
    [AllowAnonymous]
    [HttpGet("{challengeId}")]
    public async Task<IActionResult> GetDetails(CancellationToken cancellationToken)
    {

        throw new NotImplementedException();
    }

    // TODO: Save + Status -> member(only if created by them), admin
    // Save -> member(only if created by them), admin(partial)
    // Should Combine SaveDraft and Save?
    // From body, id can be null if it is an insert
    [Authorize(Roles = AuthorizeConsts.MemberAndAdmin)]
    [HttpPost("save/{challengeId?}")]
    public async Task<IActionResult> Save([FromBody] ChallengeSaveModel challengeSaveModel, [FromRoute] string? challengeId = null, CancellationToken cancellationToken = default)
    {
        var result = await this.challengeManager.Save(JwtToken, challengeId, challengeSaveModel, cancellationToken);
        return this.Process(result);
    }

    [Authorize(Roles = AuthorizeConsts.MemberAndAdmin)]
    [HttpPost("publish/{challengeId}")]
    public async Task<IActionResult> SaveAndPublish([FromRoute] string challengeId, [FromBody] ChallengeSaveModel challengeSaveModel, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
        //var response = await this.challengeManager.Save(challengeRequestSaveModel, cancellationToken); // TODO: Update
        //return this.Process(response);
    }

    [Authorize(Roles = Role.Admin)]
    [HttpPost("saveAsAdmin/{challengeId}")]
    public async Task<IActionResult> SaveAsAdmin([FromRoute] string challengeId, [FromBody] ChallengeSaveModel challengeSaveModel, CancellationToken cancellationToken)
    {
        var result = await this.challengeManager.SaveAsAdmin(challengeId, challengeSaveModel, cancellationToken);
        return this.Process(result);
    }
}
