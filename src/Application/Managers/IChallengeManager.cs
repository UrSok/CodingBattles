using Domain.Models.Challenges;
using Domain.Models.Responses;

namespace Application.Managers;

public interface IChallengeManager
{
    Task<BaseResponse> Save(string jwtToken, string? challengeId, ChallengeSaveModel challengeSaveModel, CancellationToken cancellationToken);
}
