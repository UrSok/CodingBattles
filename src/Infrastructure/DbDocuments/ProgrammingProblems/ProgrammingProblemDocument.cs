using Domain.Enums;
using Infrastructure.DbDocuments.Common;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.ProgrammingProblems;

internal class ProgrammingProblemDocument : MongoDocument
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
    public List<TestDocument> Tests { get; set; }

    [BsonElement("Solution")]
    public SolutionDocument Solution { get; set; }

    [BsonElement("Status")]
    [BsonRepresentation(BsonType.String)]
    public ProgrammingProblemStatus Status { get; set; }

    //TODO: tags, difficulty
}
