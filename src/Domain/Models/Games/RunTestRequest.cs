using Domain.Entities.Challenges;

namespace Domain.Models.Games;

public class RunTestRequest
{
    public string Id { get; set; }
    public string Language { get; set; }
    public string SourceCode { get; set; }
    public TestPair Test { get; set; }
}
