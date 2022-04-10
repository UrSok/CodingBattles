using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Tags.Queries;
internal record GetAllTagsQuery() : IRequest<Result<IEnumerable<TagEntity>>>;

internal class GetAllTagsHandler : IRequestHandler<GetAllTagsQuery, Result<IEnumerable<TagEntity>>>
{
    private readonly ITagRepository tagRepository;

    public GetAllTagsHandler(ITagRepository tagRepository)
    {
        this.tagRepository = tagRepository;
    }

    public async Task<Result<IEnumerable<TagEntity>>> Handle(GetAllTagsQuery request, CancellationToken cancellationToken)
    {
        var tags = await this.tagRepository.GetAll(cancellationToken);
        return Result<IEnumerable<TagEntity>>.Success(tags);
    }
}
