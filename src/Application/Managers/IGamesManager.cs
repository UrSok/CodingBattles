using Domain.Models.Games;
using Domain.Models.Results;

namespace Application.Managers;

public interface IGamesManager
{
    public Task<Result<RuntTestResult>> RunTest(RunTestModel model, CancellationToken cancellationToken);
}

