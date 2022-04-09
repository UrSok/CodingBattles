using Domain.Entities.Challenges;
using Domain.Entities.Common;

namespace Domain.Models.Challenges;

public class ChallengeSaveModel
{
    public string Name { get; set; }

    public string Task { get; set; }

    public string InputDescription { get; set; }

    public string OutputDescription { get; set; }

    public string Constraints { get; set; }

    public string StubGeneratorInput { get; set; }

    public List<TestPair> Tests { get; set; }

    public Solution Solution { get; set; }

    public string StatusReason { get; set; }

    public List<string> TagIds { get; set; }
}
