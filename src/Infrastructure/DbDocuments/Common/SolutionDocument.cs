namespace Infrastructure.DbDocuments.Common;

public class SolutionDocument : MongoDocument
{
    // language enum
    public string SourceCode { get; set; }
}
