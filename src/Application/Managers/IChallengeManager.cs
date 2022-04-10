using Domain.Models.Challenges;
using Domain.Models.Results;

namespace Application.Managers;

public interface IChallengeManager
{
    Task<Result<string>> Save(string jwtToken, string? challengeId, ChallengeSaveModel challengeSaveModel, CancellationToken cancellationToken);
    Task<Result> SaveAsAdmin(string challengeId, ChallengeSaveModel challengeSaveModel, CancellationToken cancellationToken);
}
