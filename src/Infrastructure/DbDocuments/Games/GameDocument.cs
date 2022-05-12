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

    [BsonElement("IsPrivate")]
    public bool IsPrivate { get; set; }

    [BsonElement("CreatedByUserId")]
    public string CreatedByUserId { get; set; }

    [BsonElement("UserIds")]
    public List<string> UserIds { get; set; }

    [BsonElement("Rounds")]
    public List<RoundDocument> Rounds { get; set; }
}
