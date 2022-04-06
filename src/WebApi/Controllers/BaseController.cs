using Domain.Models.Responses;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public class BaseController : ControllerBase
{
    protected IActionResult Process<T>(BaseResponse<T> response) =>
         response.IsSuccess
            ? this.Ok(response.Response)
            : this.BadRequest(response);

    protected IActionResult Process(BaseResponse response) =>
        response.IsSuccess
            ? this.Ok(response)
            : this.BadRequest(response);

    protected string JwtToken
    {
        get
        {
            var request = this.HttpContext.Request.Headers.Authorization;
            var token = request.ToString().Replace("Bearer ", "");
            return token;
        }
    }
}
