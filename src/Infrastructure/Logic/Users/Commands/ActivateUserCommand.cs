﻿using Ardalis.GuardClauses;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Models.Responses;
using Infrastructure.Repositories;
using MediatR;

namespace Infrastructure.Logic.Users.Commands;

internal record ActivateUserCommand(string UserId, string VerificationCode) : IRequest<BaseResponse>;

internal class ActivateUserHandler : IRequestHandler<ActivateUserCommand, BaseResponse>
{
    private readonly IUserRepository userRepository;

    public ActivateUserHandler(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public async Task<BaseResponse> Handle(ActivateUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));
        Guard.Against.NullOrEmpty(request.UserId, nameof(request.UserId));
        Guard.Against.NullOrEmpty(request.VerificationCode, nameof(request.VerificationCode));


        var user = await this.userRepository.Get(request.UserId, cancellationToken);
        if (user is null)
        {
            return BaseResponse.Failure(ErrorCode.UserNotFound);
        }

        if (user.Role != Role.UnverifiedMember)
        {
            return BaseResponse.Failure(ErrorCode.EmailAlreadyVerified);
        }

        if (user.Verification.Type != VerificationType.AccountActivation || request.VerificationCode != user.Verification.Code)
        {
            return BaseResponse.Failure(ErrorCode.InvalidVerificationCode);
        }

        await this.userRepository.ActivateUser(user.Id, Role.Member, cancellationToken);

        return BaseResponse.Success();
    }
}