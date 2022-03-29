using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

namespace Infrastructure.DbDocuments;
public class MongoDocument
{
    [BsonId]
    [BsonGuidRepresentation(GuidRepresentation.Standard)]
    public Guid Id { get; set; }

    [BsonDefaultValue(true)]
    public bool IsActive { get; set; } = true;
}
