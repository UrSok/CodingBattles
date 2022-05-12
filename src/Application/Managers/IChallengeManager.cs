using Domain.Entities.Challenges;
using Domain.Models.Challenges;
using Domain.Models.Common;
using Domain.Models.Results;

namespace Application.Managers;

public interface IChallengeManager
{
    Task<Result<string>> Save(string jwtToken, string? challengeId, ChallengeSaveModel challengeSaveModel, CancellationToken cancellationToken);
    Task<Result<PaginatedModel<ChallengeSearchResultItem>>> Get(ChallengeSearchModel challengeSearchModel, CancellationToken cancellationToken);
    Task<Result<bool>> Publish(string jwtToken, string challengeId, CancellationToken cancellationToken);
    Task<Result> Unpublish(string challengeId, string statusReason, CancellationToken cancellationToken);
    Task<Result<ChallengeResult>> Get(string challengeId, CancellationToken cancellationToken);
}
