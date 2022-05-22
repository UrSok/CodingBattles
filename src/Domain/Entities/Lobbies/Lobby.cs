namespace Domain.Entities.Lobbies;

public class Lobby : EntityWithId
{
    public string Name { get; set; }
    public string Code { get; set; }
    public string GameMasterUserId { get; set; }
    public bool IsPrivate { get; set; }


}

/*
Name
Code
Users
CreatedByUserId
IsPrivate
CurrentRound: {
	challengeId
    startTime?
	durationMinutes
	roundstatus => In Progress | Finished | Selecting Challenge 
	roundSummaryResult
}

previousRounds
*/
