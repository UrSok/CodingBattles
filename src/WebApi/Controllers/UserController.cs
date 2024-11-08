﻿using Application.Managers;
using Domain.Models.Users.RequestsResults;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Authorize]
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
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest registerUserRequest, CancellationToken cancellationToken)
    {
        var response = await this.userManager.Register(registerUserRequest, cancellationToken);
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
    public async Task<IActionResult> Authenticate([FromBody] AuthUserRequest authUserRequest, CancellationToken cancellationToken)
    {
        var response = await this.userManager.Authenticate(authUserRequest, cancellationToken);
        return this.Process(response);
    }

    [AllowAnonymous]
    [HttpGet("isUniqueEmail/{email}")]
    public async Task<IActionResult> GetAuthUserByJwtToken([FromRoute] string email, CancellationToken cancellationToken)
    {
        var result = await this.userManager.IsUniqueEmail(email, cancellationToken);
        return this.Process(result);
    }
}
