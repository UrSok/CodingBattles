namespace Infrastructure.DbDocuments.ProgrammingProblems;

public class TestPairDocument : MongoDocument
{
    public TestDocument TestCase { get; set; }
    public TestDocument TestValidator { get; set; }
}
