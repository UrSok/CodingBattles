using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Challenges;

internal class TestPairDocument
{
    [BsonElement("Title")]
    public string Title { get; set; }

    [BsonElement("Case")]
    public TestCaseDocument Case { get; set; }

    [BsonElement("Validator")]
    public TestCaseDocument Validator { get; set; }
}
