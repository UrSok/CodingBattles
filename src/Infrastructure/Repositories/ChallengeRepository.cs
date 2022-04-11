using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Models.Challenges;
using Infrastructure.DbDocuments.Challenges;
using Infrastructure.Persistence;
using Infrastructure.Utils;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

internal interface IChallengeRepository
{
    Task<string> Create(Challenge challenge, CancellationToken cancellationToken);
    Task<bool> Update(Challenge challenge, CancellationToken cancellationToken);
    Task<Challenge> Get(string id, CancellationToken cancellationToken);
    Task<(int totalPages, int totalItems, IEnumerable<Challenge>)> Get(ChallengeSearchModel challengeSearchModel, CancellationToken cancellationToken);
}

internal class ChallengeRepository : BaseRepository, IChallengeRepository
{
    private readonly IMongoCollection<ChallengeDocument> challenges;

    public ChallengeRepository(IMongoDbContext mongoDbContext, IMapper mapper) : base(mapper)
    {
        this.challenges = mongoDbContext.Challenges;
    }

    public async Task<(int totalPages, int totalItems, IEnumerable<Challenge>)> Get(ChallengeSearchModel challengeSearchModel, CancellationToken cancellationToken)
    {
        var filters = new List<FilterDefinition<ChallengeDocument>>();

        if (!string.IsNullOrEmpty(challengeSearchModel.Text))
        {
            var textFilters = Builders<ChallengeDocument>.Filter.Or(
                    Builders<ChallengeDocument>.Filter.Regex(x
                    => x.Name, new MongoDB.Bson.BsonRegularExpression(challengeSearchModel.Text, "i")),
                    Builders<ChallengeDocument>.Filter.Regex(x
                    => x.Task, new MongoDB.Bson.BsonRegularExpression(challengeSearchModel.Text, "i"))
                );

            filters.Add(textFilters);
        }

        if (challengeSearchModel.MinimumDifficulty is not null)
        {
            filters.Add(
                Builders<ChallengeDocument>.Filter.Where(x => x.Difficulty >= challengeSearchModel.MinimumDifficulty));
        }

        if (challengeSearchModel.MaximumDifficulty is not null)
        {
            filters.Add(
                Builders<ChallengeDocument>.Filter.Where(x => x.Difficulty <= challengeSearchModel.MaximumDifficulty));
        }

        if (challengeSearchModel.TagIds.Any())
        {
            filters.Add(
                Builders<ChallengeDocument>.Filter.All(x => x.TagIds, challengeSearchModel.TagIds));
        }

        var filterDefinition = filters.Count > 0 
            ? Builders<ChallengeDocument>.Filter.And(filters) 
            : FilterDefinition<ChallengeDocument>.Empty;

        var (totalPages, totalPageItems, data) = 
            await this.challenges.AggregateByPage(
            filterDefinition,
            challengeSearchModel.SortBy,
            challengeSearchModel.OrderStyle,
            challengeSearchModel.Page,
            challengeSearchModel.PageSize);

        return (totalPages, totalPageItems, this.mapper.Map<IEnumerable<Challenge>>(data));
    }

    public async Task<Challenge> Get(string id, CancellationToken cancellationToken)
    {
        var challenge = (await this.challenges
            .FindAsync(x => x.Id == id, cancellationToken: cancellationToken))
            .FirstOrDefault(cancellationToken);

        return this.mapper.Map<Challenge>(challenge);
    }

    public async Task<string> Create(Challenge challenge, CancellationToken cancellationToken)
    {
        var challengeDocument = this.mapper.Map<ChallengeDocument>(challenge);
        await this.challenges.InsertOneAsync(challengeDocument, cancellationToken: cancellationToken);
        return challengeDocument.Id;
    }

    public async Task<bool> Update(Challenge challenge, CancellationToken cancellationToken)
    {
        var challengeDocument = this.mapper.Map<ChallengeDocument>(challenge);

        var filter = Builders<ChallengeDocument>.Filter.Eq(x => x.Id, challenge.Id);
        var update = Builders<ChallengeDocument>.Update
            .Set(x => x.Name, challenge.Name)
            .Set(x => x.Task, challenge.Task)
            .Set(x => x.InputDescription, challenge.InputDescription)
            .Set(x => x.OutputDescription, challenge.OutputDescription)
            .Set(x => x.Constraints, challenge.Constraints)
            .Set(x => x.StubGeneratorInput, challenge.StubGeneratorInput)
            .Set(x => x.Tests, challengeDocument.Tests)
            .Set(x => x.Solution, challengeDocument.Solution)
            .Set(x => x.Status, challenge.Status)
            .Set(x => x.TagIds, challenge.TagIds);

        var result = await this.challenges.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }
}
