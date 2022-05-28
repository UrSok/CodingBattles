using Application.Managers;
using Domain.Models.Common.Results;
using Domain.Models.General.RequestsResults;
using Infrastructure.Logic.StubGenerator;
using MediatR;

namespace Infrastructure.Managers;

public class StubGeneratorManager : BaseManager, IStubGeneratorManager
{
    public StubGeneratorManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<Result<GenerateStubResult>> Generate(GenerateStubRequest generateStubRequest, CancellationToken cancellationToken)
    {
        var command = new GenerateCommand(generateStubRequest);
        return await this.mediator.Send(command, cancellationToken);
    }
}
