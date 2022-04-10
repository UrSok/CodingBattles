using Domain.Entities.Challenges;
using Domain.Models.Results;

namespace Application.Managers;

public interface ITagManager
{
    Task<Result<IEnumerable<TagEntity>>> GetAll(CancellationToken cancellationToken);
}
