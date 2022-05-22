using Domain.Enums;
using Infrastructure.DbDocuments.Challenges;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Games;

internal class TestSummaryDocument
{
    [BsonElement("Status")]
    [BsonRepresentation(BsonType.String)]
    public TestSummaryStatus Status { get; set; }

    [BsonElement("Reason")]
    public string Reason { get; set; }

    [BsonElement("TestPair")]
    public TestPairDocument TestPair { get; set; }
}