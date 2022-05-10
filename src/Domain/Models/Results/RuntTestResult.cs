using Domain.Models.Games;

namespace Domain.Models.Results;

public class RuntTestResult
{
    public RunResult Test { get; set; }
    public RunResult Validator { get; set; }
}
