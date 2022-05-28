using Domain.Entities.Common;
using Domain.Entities.Games;

namespace Domain.Models.Games;

public class SubmitResultRequest
{
    public string GameId { get; set; }
    public string UserId { get; set; }
    public Solution Solution { get; set; }
}
