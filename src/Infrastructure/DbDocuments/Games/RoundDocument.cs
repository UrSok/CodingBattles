#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

using Infrastructure.DbDocuments.ProgrammingProblems;

namespace Infrastructure.DbDocuments.Games;

public class RoundDocument : MongoDocument
{
    public ProgrammingProblemDocument ProgrammingProblem { get; set; }


    //TODO: Result
    //TODO: Round state?: InProgress, HasEnded
}
