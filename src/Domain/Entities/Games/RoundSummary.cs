using Domain.Entities.Common;

namespace Domain.Entities.Games;

public class RoundSummary
{
    public string UserId { get; set; }
    public Solution Solution { get; set; }
    public List<TestSummary> TestSummaries { get; set; }
}