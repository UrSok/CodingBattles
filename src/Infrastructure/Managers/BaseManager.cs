using Domain.Models.Results;
using MediatR;

namespace Infrastructure.Managers;

public abstract class BaseManager
{
    protected readonly IMediator mediator;

    protected BaseManager(IMediator mediator)
    {
        this.mediator = mediator;
    }

    protected async Task<Result> SendCommand(IRequest<Result> request, CancellationToken cancellationToken)
        => await this.mediator.Send(request, cancellationToken);

    protected async Task<Result<T>> SendCommand<T>(IRequest<Result<T>> request, CancellationToken cancellationToken) 
        => await this.mediator.Send(request, cancellationToken);
}
