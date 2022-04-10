using Application.Managers;
using Domain.Models.Common;
using Domain.Models.Results;
using Infrastructure.Logic.StubGenerator;
using MediatR;

namespace Infrastructure.Managers;

public class StubGeneratorManager : BaseManager, IStubGeneratorManager
{
    public StubGeneratorManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<Result<StubGeneratorResult>> Generate(StubGeneratorModel stubGeneratorModel, CancellationToken cancellationToken)
    {
        var command = new GenerateCommand(stubGeneratorModel);
        return await this.mediator.Send(command, cancellationToken);
    }
}
