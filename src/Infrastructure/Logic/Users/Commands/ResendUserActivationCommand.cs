using Ardalis.GuardClauses;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Models.Responses;
using Domain.Utils.MailDataModels;
using Infrastructure.Repositories;
using Infrastructure.Services.Generators;
using Infrastructure.Services.Mail;
using MediatR;

namespace Infrastructure.Logic.Users.Commands;

internal record ResendUserActivationCommand(string UserId) : IRequest<BaseResponse>;

internal class ResendUserActivationHandler : IRequestHandler<ResendUserActivationCommand, BaseResponse>
{
    private readonly IUserRepository userRepository;
    private readonly IMailService mailService;
    private readonly IUrlGeneratorService urlGeneratorService;

    public ResendUserActivationHandler(
        IUserRepository userRepository,
        IMailService mailService,
        IUrlGeneratorService urlGeneratorService)
    {
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.urlGeneratorService = urlGeneratorService;
    }

    public async Task<BaseResponse> Handle(ResendUserActivationCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));
        Guard.Against.NullOrEmpty(request.UserId, nameof(request.UserId));

        var user = await this.userRepository.Get(request.UserId, cancellationToken);
        if (user is null)
        {
            return BaseResponse.Failure(ErrorCode.UserNotFound);
        }

        if (user.Role != Role.UnverifiedMember)
        {
            return BaseResponse.Failure(ErrorCode.EmailAlreadyVerified);
        }

        var verification = new Verification()
        {
            Type = VerificationType.AccountActivation,
            Code = CodeGeneratorService.GetRandomNumericString(8), //TODO: ADD OPTIONS FOR Length and expiration..
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        };

        await this.userRepository.CreateVerification(user.Id, verification, cancellationToken);

        await this.mailService.SendAccountActivation(new VerificationMailData
        {
            Username = user.Username,
            Email = user.Email,
            VerificationCode = verification.Code,
            VerificationUrl = this.urlGeneratorService.GetActivation(user.Id, verification.Code)
        }, cancellationToken);

        return BaseResponse.Success();
    }
}
