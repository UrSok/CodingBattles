using Domain.Models.Games;
using Domain.Models.Results;

namespace Application.Managers;

public interface IGamesManager
{
    public Task<Result<RunTestResult>> RunTest(RunTestRequest model, CancellationToken cancellationToken);
}

