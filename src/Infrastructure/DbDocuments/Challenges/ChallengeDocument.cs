﻿using Domain.Enums;
using Infrastructure.DbDocuments.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Challenges;

internal class ChallengeDocument : MongoDocumentWithId
{
    [BsonElement("Name")]
    public string Name { get; set; }

    [BsonElement("Task")]
    public string Task { get; set; }

    [BsonElement("InputDescription")]
    public string InputDescription { get; set; }

    [BsonElement("OutputDescription")]
    public string OutputDescription { get; set; }

    [BsonElement("Constraints")]
    public string Constraints { get; set; }

    [BsonElement("StubGeneratorInput")]
    public string StubGeneratorInput { get; set; }

    [BsonElement("Tests")]
    public List<TestPairDocument> Tests { get; set; }

    [BsonElement("Solution")]
    public SolutionDocument Solution { get; set; }

    [BsonElement("Status")]
    [BsonRepresentation(BsonType.String)]
    public ChallengeStatus Status { get; set; }

    [BsonElement("StatusReason")]
    public string StatusReason { get; set; }

    [BsonElement("TagIds")]
    public List<string> TagIds { get; set; }

    [BsonElement("Feedbacks")]
    public List<FeedbackDocument> Feedbacks { get; set; }

    [BsonElement("Difficulty")]
    public int Difficulty { get; set; }

    [BsonElement("CreatedByUserId")]
    public string CreatedByUserId { get; set; }

    [BsonElement("LastModifiedOn")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime LastModifiedOn { get; set; }
}
