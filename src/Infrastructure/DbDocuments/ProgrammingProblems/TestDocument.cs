﻿using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.ProgrammingProblems;

internal class TestDocument
{
    [BsonElement("Input")]
    public string Input { get; set; }

    [BsonElement("ExpectedOutput")]
    public string ExpectedOutput { get; set; }
}
