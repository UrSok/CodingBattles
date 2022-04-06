using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Enums;
using Domain.Models.Challenges;
using Domain.Models.Responses;
using Infrastructure.Repositories;
using MediatR;

namespace Infrastructure.Logic.Challenges.Commands;

internal record SaveChallengeCommand(string JwtToken, string ChallengeId, ChallengeSaveModel Model) : IRequest<BaseResponse<string>>;

internal class SaveChallengeHandler : IRequestHandler<SaveChallengeCommand, BaseResponse<string>>
{
    private readonly IChallengeRepository challengeRepository;
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;

    public SaveChallengeHandler(
        IChallengeRepository challengeRepository,
        IUserRepository userRepository,
        IMapper mapper)
    {
        this.challengeRepository = challengeRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public async Task<BaseResponse<string>> Handle(SaveChallengeCommand request, CancellationToken cancellationToken) // TODO: Should add some validation for userid not being null and etc.
    {
        var challenge = this.mapper.Map<Challenge>(request.Model);
        challenge.Id = request.ChallengeId;

        var user = await this.userRepository.GetByJwtToken(request.JwtToken, cancellationToken);
        if (user is null)
        {
            return BaseResponse<string>.Failure(ErrorCode.UserNotFound);
        }

        challenge.LastModifiedOn = DateTime.Now;

        if (string.IsNullOrWhiteSpace(request.ChallengeId))
        {
            challenge.CreatedByUserId = user.Id;
            var challengeId = await this.challengeRepository.Create(challenge, cancellationToken);
            return BaseResponse<string>.Success(challengeId);
        }

        var existingChallenge = await this.challengeRepository.Get(request.ChallengeId, cancellationToken);
        if (existingChallenge.Id is null)
        {
            return BaseResponse<string>.Failure(ErrorCode.ChallengeNotFound);
        }

        if (existingChallenge.CreatedByUserId != user.Id)
        {
            return BaseResponse<string>.Failure(ErrorCode.CannotEditForeignRecord);
        }

        var result = await this.challengeRepository.Update(challenge, cancellationToken);
        if (!result)
        {
            return BaseResponse<string>.Failure(ErrorCode.InternalError);
        }

        return BaseResponse<string>.Success(existingChallenge.Id);
    }
}