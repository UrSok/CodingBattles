using Ardalis.GuardClauses;
using AutoMapper;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Models.Responses;
using Domain.Repositories;
using Domain.Utils.MailDataModels;
using Infrastructure.Utils;
using Infrastructure.Utils.Mail;
using MediatR;

namespace Application.UserLogic.Commands;

public record ResendUserActivationCommand(string UserId) : IRequest<BaseResponse>;

public class ResendUserActivationHandler : IRequestHandler<ResendUserActivationCommand, BaseResponse>
{
    private readonly IUserRepository userRepository;
    private readonly IMailService mailService;
    private readonly IUrlGenerator urlGenerator;

    public ResendUserActivationHandler(
        IUserRepository userRepository,
        IMailService mailService,
        IUrlGenerator urlGenerator)
    {
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.urlGenerator = urlGenerator;
    }

    public async Task<BaseResponse> Handle(ResendUserActivationCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));
        Guard.Against.NullOrEmpty(request.UserId, nameof(request.UserId));

        var user = await this.userRepository.Get(request.UserId, cancellationToken);
        if (user is null)
        {
            return BaseResponse.Failure(ErrorCode.NoSuchUser);
        }

        if (user.Role != Role.UnverifiedMember)
        {
            return BaseResponse.Failure(ErrorCode.EmailAlreadyVerified);
        }

        var verification = new Verification()
        {
            Type = VerificationType.AccountActivation,
            Code = CodeGenerator.GetRandomNumericString(8), //TODO: ADD OPTIONS FOR Length and expiration..
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        };

        await this.userRepository.CreateVerification(user.Id, verification, cancellationToken);

        await this.mailService.SendAccountActivation(new VerificationMailData
        {
            Username = user.Username,
            Email = user.Email,
            VerificationCode = verification.Code,
            VerificationUrl = this.urlGenerator.GetActivation(user.Id, verification.Code)
        }, cancellationToken);

        return BaseResponse.Success();
    }
}
