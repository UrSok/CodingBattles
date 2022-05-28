using Domain.Models.Common.Results;
using Domain.Models.General.RequestsResults;

namespace Application.Managers;

public interface IStubGeneratorManager
{
    Task<Result<GenerateStubResult>> Generate(GenerateStubRequest stubGeneratorModel, CancellationToken cancellationToken);
}
