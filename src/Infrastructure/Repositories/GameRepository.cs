using AutoMapper;
using Domain.Entities.Games;
using Domain.Enums;
using Infrastructure.DbDocuments.Games;
using Infrastructure.Persistence;
using Infrastructure.Utils;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

internal interface IGameRepository
{
    Task<string> Create(Game game, CancellationToken cancellationToken);
    Task<Game> GetGameByCode(string code, CancellationToken cancellationToken);
    Task<bool> AddUser(string userId, string gameId, CancellationToken cancellationToken);
    Task<Game> Get(string gameId, CancellationToken cancellationToken);
    Task<bool> StartRound(string id, Round round, CancellationToken cancellationToken);
    Task<IEnumerable<Game>> Get(CancellationToken cancellationToken);
    Task<IEnumerable<Game>> GetGamesByCreator(string userId, CancellationToken cancellationToken);
    Task<bool> AddRecordSummary(string id, int roundNumber, RoundSummary roundSummary, CancellationToken cancellationToken);
    Task<bool> RemoveFromGame(string userId, string gameId, CancellationToken cancellationToken);
}

internal class GameRepository : BaseRepository, IGameRepository
{
    private IMongoCollection<GameDocument> games;

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

    public async Task<bool> StartRound(string gameId, Round round, CancellationToken cancellationToken)
    {
        var roundDocument = this.mapper.Map<RoundDocument>(round);

        var filter = Builders<GameDocument>.Filter.Eq(x => x.Id, gameId);
        var update = Builders<GameDocument>.Update
            .AddToSet(x => x.Rounds, roundDocument);

        var result = await this.games.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<IEnumerable<Game>> Get(CancellationToken cancellationToken)
    {
        var gameDocuments = (await this.games.FindAsync(x => true, cancellationToken: cancellationToken))
            .ToEnumerable(cancellationToken: cancellationToken);
        return this.mapper.Map<IEnumerable<Game>>(gameDocuments);
    }

    public async Task<IEnumerable<Game>> GetGamesByCreator(string userId, CancellationToken cancellationToken)
    {
        var gameDocuments = (await this.games.FindAsync(x => x.CreatedByUserId == userId, cancellationToken: cancellationToken))
            .ToEnumerable(cancellationToken: cancellationToken);
        return this.mapper.Map<IEnumerable<Game>>(gameDocuments);
    }

    public async Task<bool> AddRecordSummary(string gameId, int roundNumber, RoundSummary roundSummary, CancellationToken cancellationToken)
    {
        var roundSummaryDocument = this.mapper.Map<RoundSummaryDocument>(roundSummary);

        var filter = Builders<GameDocument>.Filter
            .Where(x => x.Id == gameId 
                && x.Rounds.Any(round => round.Number == roundNumber));

        var update = Builders<GameDocument>.Update.
            AddToSet(x => x.Rounds[-1].RoundSummaries, roundSummaryDocument);


        var result = await this.games.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }

    public async Task<bool> RemoveFromGame(string userId, string gameId, CancellationToken cancellationToken)
    {
        var filter = Builders<GameDocument>.Filter.Eq(x => x.Id, gameId);
        var update = Builders<GameDocument>.Update
            .Pull(x => x.UserIds, gameId);

        var result = await this.games.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1 || result.MatchedCount == 1;
    }
}
