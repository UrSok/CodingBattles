using Application.UserLogic.Commands;
using Domain.Models.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Route("api/v1/[controller]")]
[ApiController]

public class UserController : BaseController
{
    public UserController(IMediator mediator) : base(mediator)
    {
    }

    [AllowAnonymous]
    [HttpPost("auth")]
    public async Task<IActionResult> Authenticate([FromBody] UserLoginModel userLoginModel, CancellationToken cancellationToken)
    {
        var command = new AuthUserCommand(userLoginModel);
        return await this.Process(command, cancellationToken);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationModel userRegistrationModel, CancellationToken cancellationToken)
    {
        var command = new RegisterUserCommand(userRegistrationModel);
        return await this.Process(command, cancellationToken);
    }
}
