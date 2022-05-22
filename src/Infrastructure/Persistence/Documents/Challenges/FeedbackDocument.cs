using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Challenges;

internal class FeedbackDocument : MongoDocumentWithId
{
    [BsonElement("UserId")]
    public string UserId { get; set; }

    [BsonElement("Difficulty")]
    public int Difficulty { get; set; }

    [BsonElement("Fun")]
    public int Fun { get; set; }

    [BsonElement("TestCasesRelvancy")]
    public int TestCasesRelvancy { get; set; }

    [BsonElement("Text")]
    public string Text { get; set; }

    [BsonElement("HasIssues")]
    public bool HasIssues { get; set; }

    [BsonElement("PostedOn")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime PostedOn { get; set; }
}
