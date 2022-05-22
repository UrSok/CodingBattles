using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Challenges;

internal class TagDocument : MongoDocumentWithId
{
    [BsonElement("Name")]
    public string Name { get; set; }
}
