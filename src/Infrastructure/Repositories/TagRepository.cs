using AutoMapper;
using Domain.Entities.Challenges;
using Infrastructure.DbDocuments.Challenges;
using Infrastructure.Persistence;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

internal interface ITagRepository
{
    Task<IEnumerable<TagEntity>> GetAll(CancellationToken cancellationToken);
}

internal class TagRepository : BaseRepository, ITagRepository
{
    private readonly IMongoCollection<TagDocument> tags;

    public TagRepository(IMongoDbContext mongoDbContext, IMapper mapper) : base(mapper)
    {
        this.tags = mongoDbContext.Tags;
        this.InsertTagsIfNoneExists();
    }

    #region TagsSetup
    private async Task InsertTagsIfNoneExists()
    {
        if (this.tags.EstimatedDocumentCount() < 1)
        {
            var tagDocumentList = new List<TagDocument>()
            {
                new TagDocument { Name = "Loops" },
                new TagDocument { Name = "Variables" },
                new TagDocument { Name = "Conditions" },
                new TagDocument { Name = "Encoding" },
                new TagDocument { Name = "Arrays" },
                new TagDocument { Name = "Strings" },
                new TagDocument { Name = "Hash tables" },
                new TagDocument { Name = "Parsing" },
                new TagDocument { Name = "Memoization" },
                new TagDocument { Name = "Trigonomentry" },
                new TagDocument { Name = "Physics" },
                new TagDocument { Name = "Distances" },
                new TagDocument { Name = "Mathematics" },
                new TagDocument { Name = "Pathfinding" },
                new TagDocument { Name = "Backtracking" },
                new TagDocument { Name = "Recursion" },
                new TagDocument { Name = "Cryptography" },
                new TagDocument { Name = "Binary search" },
                new TagDocument { Name = "Intervals" },
                new TagDocument { Name = "Dynamic programminmg" },
            };

            await this.tags.InsertManyAsync(tagDocumentList);
        }
    }
    #endregion

    public async Task<IEnumerable<TagEntity>> GetAll(CancellationToken cancellationToken)
    {
        var tagDocuments = (await this.tags.FindAsync(x => true, cancellationToken: cancellationToken))
            .ToEnumerable(cancellationToken: cancellationToken);
        return this.mapper.Map<IEnumerable<TagEntity>>(tagDocuments);
    }
}
