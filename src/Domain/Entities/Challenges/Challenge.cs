using Domain.Entities.Common;
using Domain.Enums;

namespace Domain.Entities.Challenges;

public class Challenge : EntityWithId
{
    public string Name { get; set; }

    public string DescriptionShort { get; set; }

    public string DescriptionMarkdown { get; set; }

    public string StubGeneratorInput { get; set; }

    public ChallengeStatus Status { get; set; }

    public string StatusReason { get; set; }

    public List<TestPair> Tests { get; set; }

    public Solution Solution { get; set; }

    public List<string> TagIds { get; set; }

    public List<Feedback> Feedbacks { get; set; }

    public float Difficulty { get; set; }

    public string CreatedByUserId { get; set; }

    public DateTime LastModifiedOn { get; set; }
}
