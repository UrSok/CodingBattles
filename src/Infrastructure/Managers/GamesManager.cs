using Application.Managers;
using Domain.Models.Games;
using Domain.Models.Results;
using Infrastructure.Logic.Games.Commands;
using MediatR;

namespace Infrastructure.Managers;

public class GamesManager : BaseManager, IGamesManager
{
    public GamesManager(IMediator mediator) : base(mediator)
    {
    }

    public Task<Result<RuntTestResult>> RunTest(RunTestModel model, CancellationToken cancellationToken)
    {
        var command = new RunTestCommand(model);
        return this.SendCommand(command, cancellationToken);
    }
}