using Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Games;

internal class GameDocument : MongoDocumentWithId
{
    [BsonElement("Code")]
    public string Code { get; set; }

    [BsonElement("Name")]
    public string Name { get; set; }

    [BsonElement("Status")]
    [BsonRepresentation(BsonType.String)]
    public GameStatus Status { get; set; }

    [BsonElement("IsPrivate")]
    public bool IsPrivate { get; set; }

    [BsonElement("GameMasterUserId")]
    public string GameMasterUserId { get; set; }

    [BsonElement("UserIds")]
    public List<string> UserIds { get; set; }

    [BsonElement("CurrentRound")]
    public RoundDocument CurrentRound { get; set; }

    [BsonElement("PreviousRounds")]
    public List<RoundDocument> PreviousRounds { get; set; }
}
