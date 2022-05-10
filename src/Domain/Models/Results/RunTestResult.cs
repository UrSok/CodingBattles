using Domain.Models.Games;

namespace Domain.Models.Results;

public class RunTestResult
{
    public string Id { get; set; }
    public TestResult Test { get; set; }
    public TestResult Validator { get; set; }
}
