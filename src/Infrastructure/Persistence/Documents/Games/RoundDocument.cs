using Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Games;

internal class RoundDocument
{
    [BsonElement("Number")]
    public int Number { get; set; }

    [BsonElement("StartTime")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public  DateTime StartTime { get; set; }

    [BsonElement("DurationMinutes")]
    public int DurationMinutes { get; set; }

    [BsonElement("ChallengeId")]
    public string ChallengeId { get; set; }

    [BsonElement("RoundSummaries")]
    public List<RoundSummaryDocument> RoundSummaries { get; set; }
}
