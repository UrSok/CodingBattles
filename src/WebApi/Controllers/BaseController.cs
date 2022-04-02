using Domain.Models.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace WebApi.Controllers;

public class BaseController : ControllerBase
{
    private readonly IMediator mediator;

    public BaseController(IMediator mediator)
    {
        this.mediator = mediator;
    }

    protected async Task<IActionResult> Process<T>(IRequest<BaseResponse<T>> request, CancellationToken cancellationToken)
    {
        var response = await this.mediator.Send(request, cancellationToken);

        return response.IsSuccess
            ? this.Ok(response.Response)
            : this.BadRequest(response);
    }

    protected async Task<IActionResult> Process(IRequest<BaseResponse> request, CancellationToken cancellationToken)
    {
        var response = await this.mediator.Send(request, cancellationToken);

        return response.IsSuccess
            ? this.Ok(response)
            : this.BadRequest(response);
    }
}
