using Domain.Entities.Challenges;
using Domain.Models.Common.Results;

namespace Application.Managers;

public interface ITagManager
{
    Task<Result<IEnumerable<TagEntity>>> GetAll(CancellationToken cancellationToken);
}
