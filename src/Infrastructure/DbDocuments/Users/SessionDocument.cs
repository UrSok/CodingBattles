using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Infrastructure.DbDocuments.Users;

public class SessionDocument : MongoDocument
{
    [BsonElement("Token")]
    public string Token { get; set; }

    [BsonElement("ExpiresAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime ExpiresAt { get; set; }
}
