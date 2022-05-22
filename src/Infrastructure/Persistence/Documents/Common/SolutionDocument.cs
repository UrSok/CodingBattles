using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Common;

internal class SolutionDocument : MongoDocumentWithId
{
    [BsonElement("Language")]
    public string Language { get; set; }

    [BsonElement("SourceCode")]
    public string SourceCode { get; set; }
}
