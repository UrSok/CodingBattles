using Domain.Models.Challenges;
using Domain.Models.Challenges.RequestsResults;
using Domain.Models.Common;
using Domain.Models.Common.Results;

namespace Application.Managers;

public interface IChallengeManager
{
    Task<Result<string>> Save(string jwtToken, string? challengeId, ChallengeSaveRequest challengeSaveRequest, CancellationToken cancellationToken);
    Task<Result<Paginated<ChallengeSearchItem>>> Get(ChallengeSearchRequest challengeSearchRequest, CancellationToken cancellationToken);
    Task<Result> Publish(string jwtToken, string challengeId, CancellationToken cancellationToken);
    Task<Result> Unpublish(string challengeId, string statusReason, CancellationToken cancellationToken);
    Task<Result<ChallengeDto>> Get(string challengeId, CancellationToken cancellationToken);
}
