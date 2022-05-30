using Domain.Entities.Common;
using Domain.Enums;

namespace Domain.Entities.Games;

public class RoundSummary
{
    public RoundSummaryStatus Status { get; set; }
    public string UserId { get; set; }
    public int Score { get; set; }
    public int TimePassed { get; set; }
    public bool SolutionShared { get; set; }
    public Solution Solution { get; set; }
    public List<TestSummary> TestSummaries { get; set; }
}