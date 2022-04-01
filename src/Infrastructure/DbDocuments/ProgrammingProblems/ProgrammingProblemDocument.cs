using Infrastructure.DbDocuments.Common;

namespace Infrastructure.DbDocuments.ProgrammingProblems;


public class ProgrammingProblemDocument : MongoDocument
{
    public string Name { get; set; }
    public string Description { get; set; }
    //TODO: More descritpion props needed?
    public string StubGeneratorInput { get; set; }
    public List<TestDocument> Tests { get; set; }
    public SolutionDocument Solution { get; set; }

    //TODO: problem stage: bad solution and etc.
    //TODO: tags, difficulty
}
