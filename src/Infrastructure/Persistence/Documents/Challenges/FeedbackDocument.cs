using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Challenges;

internal class FeedbackDocument : MongoDocumentWithId
{
    [BsonElement("UserId")]
    public string UserId { get; set; }

    [BsonElement("Difficulty")]
    public float Difficulty { get; set; }

    [BsonElement("Fun")]
    public float Fun { get; set; }

    [BsonElement("TestCasesRelvancy")]
    public float TestCasesRelvancy { get; set; }

    [BsonElement("Text")]
    public string Text { get; set; }
}
