using Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Users;

internal class VerificationDocument : MongoDocument
{
    [BsonElement("Code")]
    public string Code { get; set; }

    [BsonElement("Type")]
    [BsonRepresentation(BsonType.String)]
    public VerificationType Type { get; set; }

    [BsonElement("ExpiresAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime ExpiresAt { get; set; }
}
