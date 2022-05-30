using Domain.Enums;
using Domain.Models.Users;
using Infrastructure.DbDocuments.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Games;

internal class RoundSummaryDocument
{
    [BsonElement("Status")]
    [BsonRepresentation(BsonType.String)]
    public RoundSummaryStatus Status { get; set; }

    [BsonElement("UserId")]
    public string UserId { get; set; }

    [BsonElement("Score")]
    public int Score { get; set; }

    [BsonElement("TimePassed")]
    public int TimePassed { get; set; }

    [BsonElement("SolutionShared")]
    public bool SolutionShared { get; set; }

    [BsonElement("Solution")]
    public SolutionDocument Solution { get; set; }

    [BsonElement("TestSummaries")]
    public List<TestSummaryDocument> TestSummaries { get; set; }
}
