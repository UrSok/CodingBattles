using Domain.Entities.Common;
using Domain.Entities.Games;
using Domain.Enums;
using Domain.Models.Users;

namespace Domain.Models.Games;

public class RoundSummaryDto
{
    public RoundSummaryStatus Status { get; set; }
    public UserDto User { get; set; }
    public int Score { get; set; }
    public int TimePassed { get; set; }
    public bool SolutionShared { get; set; }
    public Solution Solution { get; set; }
    public List<TestSummary> TestSummaries { get; set; }

}
