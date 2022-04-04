using Application.Managers;
using Domain.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class UserController : BaseController
{
    private readonly IUserManager userManager;

    public UserController(IUserManager userManager)
    {
        this.userManager = userManager;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationModel userRegistrationModel, CancellationToken cancellationToken)
    {
        var response = await this.userManager.Register(userRegistrationModel, cancellationToken);
        return this.Process(response);
    }

    [AllowAnonymous]
    [HttpPost("{userId}/activate/{verificationCode}")]
    public async Task<IActionResult> ActivateUser([FromRoute] string userId, [FromRoute] string verificationCode, CancellationToken cancellationToken)
    {
        var response = await this.userManager.Activate(userId, verificationCode, cancellationToken);
        return this.Process(response);
    }

    [AllowAnonymous]
    [HttpPost("{userId}/activate/resend")]
    public async Task<IActionResult> ResendUserActivation([FromRoute] string userId, CancellationToken cancellationToken)
    {
        var response = await this.userManager.ResendActivation(userId, cancellationToken);
        return this.Process(response);
    }

    [AllowAnonymous]
    [HttpPost("auth")]
    public async Task<IActionResult> Authenticate([FromBody] UserLoginModel userLoginModel, CancellationToken cancellationToken)
    {
        var response = await this.userManager.Authenticate(userLoginModel, cancellationToken);
        return this.Process(response);
    }
}
