using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Users;

internal class SessionDocument
{
    [BsonElement("Token")]
    public string Token { get; set; }

    [BsonElement("ExpiresAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime ExpiresAt { get; set; }
}
