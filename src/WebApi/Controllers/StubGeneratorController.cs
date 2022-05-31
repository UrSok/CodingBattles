using Application.Managers;
using Domain.Models.General.RequestsResults;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Authorize]
[Route("api/v1/[controller]")]
[ApiController]
public class StubGeneratorController : BaseController
{
    private readonly IStubGeneratorManager stubGeneratorMananger;

    public StubGeneratorController(IStubGeneratorManager stubGeneratorMananger)
    {
        this.stubGeneratorMananger = stubGeneratorMananger;
    }

    [HttpPost]
    public async Task<IActionResult> Generate([FromBody] GenerateStubRequest generateStubRequest, CancellationToken cancellationToken)
    {
        var result = await this.stubGeneratorMananger.Generate(generateStubRequest, cancellationToken);
        return this.Process(result);
    }
}
