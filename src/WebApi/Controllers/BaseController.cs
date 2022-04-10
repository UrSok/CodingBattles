using Domain.Models.Results;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public class BaseController : ControllerBase
{
    protected IActionResult Process<T>(Result<T> result) =>
         result.IsSuccess
            ? this.Ok(result)
            : this.BadRequest(result);

    protected IActionResult Process(Result result) =>
        result.IsSuccess
            ? this.Ok(result)
            : this.BadRequest(result);

    protected string JwtToken
    {
        get
        {
            var request = HttpContext.Request.Headers.Authorization;
            var token = request.ToString().Replace("Bearer ", "");
            return token;
        }
    }
}
