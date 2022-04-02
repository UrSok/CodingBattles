using Infrastructure.DbDocuments.ProgrammingProblems;

namespace Infrastructure.DbDocuments.Games;

public class RoundDocument : MongoDocument
{
    public Guid ProgrammingProblemId { get; set; }


    //TODO: Result
    //TODO: Round state?: InProgress, HasEnded
}
