using Domain.Models.Responses;
using MediatR;

namespace Infrastructure.Managers;

public abstract class BaseManager
{
    private readonly IMediator mediator;

    protected BaseManager(IMediator mediator) 
    {
        this.mediator = mediator;
    }

    protected async Task<BaseResponse> SendCommand(IRequest<BaseResponse> request, CancellationToken cancellationToken)
    {
        return await this.mediator.Send(request, cancellationToken);
    }

    protected async Task<BaseResponse<T>> SendCommand<T>(IRequest<BaseResponse<T>> request, CancellationToken cancellationToken)
    {
        return await this.mediator.Send(request, cancellationToken);
    }
}
