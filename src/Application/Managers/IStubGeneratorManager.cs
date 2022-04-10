using Domain.Models.Common;
using Domain.Models.Results;

namespace Application.Managers;

public interface IStubGeneratorManager
{
    Task<Result<StubGeneratorResult>> Generate(StubGeneratorModel stubGeneratorModel, CancellationToken cancellationToken);
}
