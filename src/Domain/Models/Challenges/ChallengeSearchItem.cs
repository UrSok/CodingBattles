using Domain.Entities.Challenges;
using Domain.Enums;

namespace Domain.Models.Challenges;

public class ChallengeSearchItem
{
    public string Id { get; set; }
    public string CreatedByUserId { get; set; }
    public string Name { get; set; }
    public string DescriptionShort { get; set; }
    public double Difficulty { get; set; }
    public ChallengeStatus Status { get; set; }
    public List<TagEntity> Tags { get; set; }
}
