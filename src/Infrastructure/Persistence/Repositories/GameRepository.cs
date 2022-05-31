using AutoMapper;
using Domain.Entities.Games;
using Domain.Enums;
using Infrastructure.DbDocuments.Games;
using Infrastructure.Persistence;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

internal interface IGameRepository
{
    Task<string> Create(Game game, CancellationToken cancellationToken);
    Task<Game> GetGameByCode(string code, CancellationToken cancellationToken);
    Task<bool> AddUser(string userId, string gameId, CancellationToken cancellationToken);
    Task<Game> Get(string gameId, CancellationToken cancellationToken);
    Task<bool> CreateCurrentRound(string gameId, Round round, CancellationToken cancellationToken);
    Task<bool> UpdateCurrentRound(string gameId, Round round, CancellationToken cancellationToken);
    Task<IEnumerable<Game>> Get(CancellationToken cancellationToken);
    Task<IEnumerable<Game>> GetGamesByUserId(string userId, CancellationToken cancellationToken);
    Task<bool> ReplaceSummaryRecord(string gameId, RoundSummary roundSummary, CancellationToken cancellationToken);
    Task<bool> RemoveFromGame(string gameId, string userId, CancellationToken cancellationToken);
    Task<bool> UpdateGameStatus(string gameId, GameStatus status, CancellationToken cancellationToken);
    Task<bool> ShareSolution(string gameId, int roundNumber, string userId, CancellationToken cancellationToken);
}

internal class GameRepository : BaseRepository, IGameRepository
{
    private readonly IMongoCollection<GameDocument> games;

    public GameRepository(IMongoDbContext mongoDbContext, IMapper mapper) : base(mapper)
    {
        this.games = mongoDbContext.Games;
    }

    public async Task<string> Create(Game game, CancellationToken cancellationToken)
    {
        var gameDocument = this.mapper.Map<GameDocument>(game);

        await this.games.InsertOneAsync(gameDocument, cancellationToken: cancellationToken);
        return gameDocument.Id;
    }

    public async Task<Game> GetGameByCode(string code, CancellationToken cancellationToken)
    {
        var gameDocument = (await this.games
            .FindAsync(x => x.Code == code, cancellationToken: cancellationToken))
            .FirstOrDefault(cancellationToken);

        return this.mapper.Map<Game>(gameDocument);
    }

    public async Task<bool> AddUser(string userId, string gameId, CancellationToken cancellationToken)
    {
        var filter = Builders<GameDocument>.Filter.Eq(x => x.Id, gameId);
        var update = Builders<GameDocument>.Update
            .AddToSet(x => x.UserIds, userId);

        var result = await this.games.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<Game> Get(string gameId, CancellationToken cancellationToken)
    {
        var gameDocument = (await this.games
            .FindAsync(x => x.Id == gameId, cancellationToken: cancellationToken))
            .FirstOrDefault(cancellationToken);

        return this.mapper.Map<Game>(gameDocument);

    }

    public async Task<bool> CreateCurrentRound(string gameId, Round round, CancellationToken cancellationToken)
    {
        var roundDocument = this.mapper.Map<RoundDocument>(round);

        var filter = Builders<GameDocument>.Filter.Eq(x => x.Id, gameId);
        var update = Builders<GameDocument>.Update
            .PushEach(x => x.Rounds, new List<RoundDocument> { roundDocument }, position: 0);

        var result = await this.games.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<bool> UpdateCurrentRound(string gameId, Round round, CancellationToken cancellationToken)
    {
        var roundDocument = this.mapper.Map<RoundDocument>(round);

        var filter = Builders<GameDocument>.Filter.Eq(x => x.Id, gameId);
        var update = Builders<GameDocument>.Update
            .Set(x => x.Rounds[0], roundDocument);

        var result = await this.games.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<IEnumerable<Game>> Get(CancellationToken cancellationToken)
    {
        var gameDocuments = (await this.games.FindAsync(x => true, cancellationToken: cancellationToken))
            .ToEnumerable(cancellationToken: cancellationToken);
        return this.mapper.Map<IEnumerable<Game>>(gameDocuments);
    }

    public async Task<IEnumerable<Game>> GetGamesByUserId(string userId, CancellationToken cancellationToken)
    {
        var gameDocuments = (await this.games.FindAsync(x => x.GameMasterUserId == userId || x.UserIds.Contains(userId), cancellationToken: cancellationToken))
            .ToEnumerable(cancellationToken: cancellationToken);
        return this.mapper.Map<IEnumerable<Game>>(gameDocuments);
    }

    public async Task<bool> ReplaceSummaryRecord(string gameId, RoundSummary roundSummary, CancellationToken cancellationToken)
    {
        var roundSummaryDocument = this.mapper.Map<RoundSummaryDocument>(roundSummary);

        var filter = Builders<GameDocument>.Filter
            .Where(x => x.Id == gameId);
        filter &=
            Builders<GameDocument>.Filter.ElemMatch(x => x.Rounds[0].RoundSummaries,
            y => y.UserId == roundSummary.UserId);

        var update = Builders<GameDocument>.Update
            .Set(x => x.Rounds[0].RoundSummaries[-1], roundSummaryDocument);

        var result = await this.games.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<bool> RemoveFromGame(string gameId, string userId, CancellationToken cancellationToken)
    {
        var filter = Builders<GameDocument>.Filter.Eq(x => x.Id, gameId);
        var update = Builders<GameDocument>.Update
            .Pull(x => x.UserIds, userId);

        var result = await this.games.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<bool> UpdateGameStatus(string gameId, GameStatus status, CancellationToken cancellationToken)
    {
        var filter = Builders<GameDocument>.Filter.Eq(x => x.Id, gameId);
        var update = Builders<GameDocument>.Update
            .Set(x => x.Status, status);

        var result = await this.games.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<bool> ShareSolution(string gameId, int roundNumber, string userId, CancellationToken cancellationToken)
    {
        var filter = Builders<GameDocument>.Filter
            .Where(x => x.Id == gameId);

        var update = Builders<GameDocument>.Update
            .Set("Rounds.$[i].RoundSummaries.$[j].SolutionShared", true);

        var arrayFilters = new List<ArrayFilterDefinition>
        {
            new BsonDocumentArrayFilterDefinition<BsonDocument>(new BsonDocument("i.Number", roundNumber)),
            new BsonDocumentArrayFilterDefinition<BsonDocument>(new BsonDocument("j.UserId", userId))
        };

        var updateOptions = new UpdateOptions { ArrayFilters = arrayFilters };
        var result = await this.games.UpdateOneAsync(filter, update, updateOptions, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }
}
