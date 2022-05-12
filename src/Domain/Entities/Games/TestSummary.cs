using Domain.Entities.Challenges;
using Domain.Enums;

namespace Domain.Entities.Games;

public class TestSummary
{
    public TestSummaryStatus Status { get; set; }
    public string Reason { get; set; }
    public TestPair TestPair { get; set; }
}