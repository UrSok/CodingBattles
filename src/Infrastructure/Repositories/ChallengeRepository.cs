using AutoMapper;
using Domain.Entities.Challenges;
using Infrastructure.DbDocuments.Challenges;
using Infrastructure.DbDocuments.Common;
using Infrastructure.Persistence;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

internal interface IChallengeRepository
{
    Task<string> Create(Challenge challenge, CancellationToken cancellationToken);
    Task<bool> Update(Challenge challenge, CancellationToken cancellationToken);
    Task<Challenge> Get(string id, CancellationToken cancellationToken);
}

internal class ChallengeRepository : BaseRepository, IChallengeRepository
{
    private readonly IMongoCollection<ChallengeDocument> challenges;

    public ChallengeRepository(IMongoDbContext mongoDbContext, IMapper mapper) : base(mapper)
    {
        this.challenges = mongoDbContext.Challenges;
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
