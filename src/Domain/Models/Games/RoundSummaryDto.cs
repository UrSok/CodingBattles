using Domain.Entities.Common;
using Domain.Entities.Games;
using Domain.Models.Users;

namespace Domain.Models.Games;

public class RoundSummaryDto
{
    public UserDto User { get; set; }
    public Solution Solution { get; set; }
    public List<TestSummary> TestSummaries { get; set; }

}
