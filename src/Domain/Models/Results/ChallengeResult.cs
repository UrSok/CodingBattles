using Domain.Entities.Challenges;
using Domain.Entities.Common;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Results;
using Domain.Models.Users;

namespace Domain.Models.Results;

public class ChallengeResult
{
    public string Id { get; set; }

    public string Name { get; set; }

    public string DescriptionShort { get; set; }

    public string DescriptionMarkdown { get; set; }

    public string StubGeneratorInput { get; set; }

    public ChallengeStatus Status { get; set; }

    public string StatusReason { get; set; }

    public List<TestPair> Tests { get; set; }

    public Solution Solution { get; set; }

    public List<TagEntity> Tags { get; set; }

    public List<Feedback> Feedbacks { get; set; }

    public float Difficulty { get; set; }

    public UserModel User { get; set; }

    public DateTime LastModifiedOn { get; set; }
}
