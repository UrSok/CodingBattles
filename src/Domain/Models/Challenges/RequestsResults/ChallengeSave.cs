using Domain.Entities.Challenges;
using Domain.Entities.Common;

namespace Domain.Models.Challenges.RequestsResults;

public class ChallengeSaveRequest
{
    public string Name { get; set; }

    public string DescriptionShort { get; set; }

    public string DescriptionMarkdown { get; set; }

    public string StubGeneratorInput { get; set; }

    public List<TestPair> Tests { get; set; }

    public Solution Solution { get; set; }

    public List<string> TagIds { get; set; }
}
