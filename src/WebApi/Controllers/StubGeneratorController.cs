using Application.Managers;
using Domain.Models.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class StubGeneratorController : BaseController
{
    private readonly IStubGeneratorManager stubGeneratorMananger;

    public StubGeneratorController(IStubGeneratorManager stubGeneratorMananger)
    {
        this.stubGeneratorMananger = stubGeneratorMananger;
    }


    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Generate([FromBody] StubGeneratorModel stubGeneratorModel, CancellationToken cancellationToken)
    {
        var result = await this.stubGeneratorMananger.Generate(stubGeneratorModel, cancellationToken);
        return this.Process(result);
    }
}
