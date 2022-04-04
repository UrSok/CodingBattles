using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Common;

internal class SolutionDocument : MongoDocument
{
    // language enum
    // passed tests?
    // 

    [BsonElement("SourceCode")]
    public string SourceCode { get; set; }
}
