using Domain.Models.Users;
using Infrastructure.DbDocuments.Common;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Games;

internal class RoundSummaryDocument
{
    [BsonElement("UserId")]
    public string UserId { get; set; }

    [BsonElement("Solution")]
    public SolutionDocument Solution { get; set; }

    [BsonElement("TestSummaries")]
    public List<TestSummaryDocument> TestSummaries { get; set; }
}
