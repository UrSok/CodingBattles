using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Challenges;

internal class TestCaseDocument
{
    [BsonElement("Input")]
    public string Input { get; set; }

    [BsonElement("ExpectedOutput")]
    public string ExpectedOutput { get; set; }
}
