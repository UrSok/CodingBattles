﻿using Application.Managers;
using Domain.Entities.Challenges;
using Domain.Models.Challenges;
using Domain.Models.Challenges.RequestsResults;
using Domain.Models.Common;
using Domain.Models.Common.Results;
using Infrastructure.Logic.Challenges.Commands;
using Infrastructure.Logic.Challenges.Queries;
using Infrastructure.Logic.Games.Queries;
using MediatR;

namespace Infrastructure.Managers;

public class ChallengeManager : BaseManager, IChallengeManager
{
    public ChallengeManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<Result<Paginated<ChallengeSearchItem>>> Get(ChallengeSearchRequest challengeSearchRequest, CancellationToken cancellationToken)
    {
        var query = new GetChallengesQuery(challengeSearchRequest);
        return await this.SendCommand(query, cancellationToken);
    }

    public async Task<Result<ChallengeDto>> Get(string challengeId, CancellationToken cancellationToken)
    {
        var query = new GetChallengeQuery(challengeId);
        return await this.SendCommand(query, cancellationToken);
    }

    public async Task<Result<string>> Save(string jwtToken, string challengeId, ChallengeSaveRequest challengeSaveRequest, CancellationToken cancellationToken)
    {
        var command = new SaveChallengeCommand(jwtToken, challengeId, challengeSaveRequest);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result> Publish(string jwtToken, string challengeId, CancellationToken cancellationToken)
    {
        var command = new PublishChallengeCommand(jwtToken, challengeId);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result> Unpublish(string challengeId, string statusReason, CancellationToken cancellationToken)
    {
        var command = new UnpublishCommand(challengeId, statusReason);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result> SendFeedback(string challengeId, Feedback feedback, CancellationToken cancellationToken)
    {
        var command = new SendFeedbackCommand(challengeId, feedback);
        return await this.SendCommand(command, cancellationToken);
    }

    public async Task<Result<List<ChallengeSearchItem>>> GetByUserId(string userId, CancellationToken cancellationToken)
    {
        var query = new GetChallengesByUserIdQuery(userId);
        return await this.SendCommand(query, cancellationToken);
    }
}
