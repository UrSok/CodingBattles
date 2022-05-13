using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Enums;
using Domain.Models.Challenges;
using Infrastructure.DbDocuments.Challenges;
using Infrastructure.Persistence;
using Infrastructure.Utils;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

internal interface IChallengeRepository
{
    Task<(int totalPages, int totalItems, IEnumerable<Challenge>)> Get(ChallengeSearchModel challengeSearchModel, CancellationToken cancellationToken);
    Task<Challenge> Get(string id, CancellationToken cancellationToken);
    Task<string> Create(Challenge challenge, CancellationToken cancellationToken);
    Task<bool> Update(Challenge challenge, CancellationToken cancellationToken);
    Task<bool> Publish(Challenge challenge, CancellationToken cancellationToken);
    Task<bool> Unpublish(string id, string statusReason, CancellationToken cancellationToken);
    Task<IEnumerable<Challenge>> GetByIds(IEnumerable<string> enumerable, CancellationToken cancellationToken);
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
        //filters.Add(Builders<ChallengeDocument>.Filter.Eq(x => x.Status, ChallengeStatus.Published));

        if (!string.IsNullOrEmpty(challengeSearchModel.Text))
        {
            var textFilters = Builders<ChallengeDocument>.Filter.Or(
                    Builders<ChallengeDocument>.Filter.Regex(x
                    => x.Name, new MongoDB.Bson.BsonRegularExpression(challengeSearchModel.Text, "i")),
                    Builders<ChallengeDocument>.Filter.Regex(x
                    => x.DescriptionShort, new MongoDB.Bson.BsonRegularExpression(challengeSearchModel.Text, "i"))
                );

            filters.Add(textFilters);
        }

        var minFilter = Builders<ChallengeDocument>.Filter.Where(x => x.Difficulty >= 1);
        var maxFilter = Builders<ChallengeDocument>.Filter.Where(x => x.Difficulty <= 5);
        var includeNoDifficultyFilter = Builders<ChallengeDocument>.Filter.Where(x => x.Difficulty == 0);

        if (challengeSearchModel.MinimumDifficulty is not null)
        {
            minFilter = Builders<ChallengeDocument>.Filter.Where(x => x.Difficulty >= challengeSearchModel.MinimumDifficulty);
        }

        if (challengeSearchModel.MaximumDifficulty is not null)
        {
            maxFilter = Builders<ChallengeDocument>.Filter.Where(x => x.Difficulty <= challengeSearchModel.MaximumDifficulty);
        }

        var minMaxFilter = Builders<ChallengeDocument>.Filter.And(minFilter, maxFilter);
        var difficultiesFilter = Builders<ChallengeDocument>.Filter.Or(minMaxFilter, includeNoDifficultyFilter);

        if (!challengeSearchModel.IncludeNoDifficulty)
        {
            difficultiesFilter = Builders<ChallengeDocument>.Filter.Or(minMaxFilter);
        }

        filters.Add(difficultiesFilter);

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
            .Set(x => x.DescriptionShort, challenge.DescriptionShort)
            .Set(x => x.DescriptionMarkdown, challenge.DescriptionMarkdown)
            .Set(x => x.StubGeneratorInput, challenge.StubGeneratorInput)
            .Set(x => x.Tests, challengeDocument.Tests)
            .Set(x => x.Solution, challengeDocument.Solution)
            .Set(x => x.Status, challenge.Status)
            .Set(x => x.TagIds, challenge.TagIds);

        var result = await this.challenges.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<bool> Publish(Challenge challenge, CancellationToken cancellationToken)
    {
        var filter = Builders<ChallengeDocument>.Filter.Eq(x => x.Id, challenge.Id);
        var update = Builders<ChallengeDocument>.Update
            .Set(x => x.Status, challenge.Status)
            .Set(x => x.LastModifiedOn, challenge.LastModifiedOn);

        var result = await this.challenges.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<bool> Unpublish(string id, string statusReason, CancellationToken cancellationToken)
    {
        var filter = Builders<ChallengeDocument>.Filter.Eq(x => x.Id, id);
        var update = Builders<ChallengeDocument>.Update
            .Set(x => x.Status, ChallengeStatus.Unpublished)
            .Set(x => x.StatusReason, statusReason)
            .Set(x => x.LastModifiedOn, DateTime.Now);

        var result = await this.challenges.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<IEnumerable<Challenge>> GetByIds(IEnumerable<string> challengeIds, CancellationToken cancellationToken)
    {
        var filter = Builders<ChallengeDocument>.Filter.In(x => x.Id, challengeIds);
        var challengeDocumnts = (await this.challenges.FindAsync(filter, cancellationToken: cancellationToken))
            .ToEnumerable(cancellationToken: cancellationToken);
        return this.mapper.Map<IEnumerable<Challenge>>(challengeDocumnts);
    }
}
