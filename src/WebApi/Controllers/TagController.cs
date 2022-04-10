using Application.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class TagController : BaseController
{
    private readonly ITagManager tagMananger;

    public TagController(ITagManager tagMananger)
    {
        this.tagMananger = tagMananger;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await this.tagMananger.GetAll(cancellationToken);
        return this.Process(result);
    }
}
