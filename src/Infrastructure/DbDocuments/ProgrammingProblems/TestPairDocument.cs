namespace Infrastructure.DbDocuments.ProgrammingProblems;

internal class TestPairDocument : MongoDocument
{
    public TestDocument TestCase { get; set; }
    public TestDocument TestValidator { get; set; }
}
