using Application.Managers;
using Domain.Models.Challenges;
using Domain.Models.Common;
using Domain.Models.Results;
using Infrastructure.Logic.Challenges.Commands;
using Infrastructure.Logic.Challenges.Queries;
using MediatR;

namespace Infrastructure.Managers;

public class ChallengeManager : BaseManager, IChallengeManager
{
    public ChallengeManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<Result<PaginatedModel<ChallengeSearchResultItem>>> Get(ChallengeSearchModel challengeSearchModel, CancellationToken cancellationToken)
    {
        var query = new GetChallengesQuery(challengeSearchModel);
        return await this.SendCommand(query, cancellationToken);
    }

    public async Task<Result<string>> Save(string jwtToken, string challengeId, ChallengeSaveModel challengeSaveModel, CancellationToken cancellationToken)
    {
        var command = new SaveChallengeCommand(jwtToken, challengeId, challengeSaveModel);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result> SaveAsAdmin(string challengeId, ChallengeSaveModel challengeSaveModel, CancellationToken cancellationToken)
    {
        var command = new SaveAsAdminChallengeCommand(challengeId, challengeSaveModel);
        return await this.SendCommand(command, cancellationToken);
    }
}
