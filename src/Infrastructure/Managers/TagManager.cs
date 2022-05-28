using Application.Managers;
using Domain.Entities.Challenges;
using Domain.Models.Common.Results;
using Infrastructure.Logic.Tags.Queries;
using MediatR;

namespace Infrastructure.Managers;

public class TagManager : BaseManager, ITagManager
{
    public TagManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<Result<IEnumerable<TagEntity>>> GetAll(CancellationToken cancellationToken)
    {
        var query = new GetAllTagsQuery();
        return await this.mediator.Send(query, cancellationToken);
    }
}
