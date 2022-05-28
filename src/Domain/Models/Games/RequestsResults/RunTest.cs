using Domain.Entities.Challenges;
using Domain.Entities.Common;

namespace Domain.Models.Games.RequestsResults;

public class RunTestRequest
{
    public string Id { get; set; }
    public Solution Solution { get; set; }
    public TestPair Test { get; set; }
}
public class RunTestResult
{
    public string Id { get; set; }
    public string OutputError { get; set; }
    public TestResult Test { get; set; }
    public TestResult Validator { get; set; }
}
