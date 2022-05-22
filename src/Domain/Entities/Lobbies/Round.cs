using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Lobbies;

public class Round
{
    public string ChallengeId { get; set; }
    public DateTime? StartTime { get; set; }
    public int DurationInMinutes { get; set; }
    public RoundStatus Status { get; set; }
    // other important things
}
