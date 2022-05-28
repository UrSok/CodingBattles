using Ardalis.GuardClauses;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using Domain.Models.Mails;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Services.Generators;
using Infrastructure.Services.Mail;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Users.Commands;

internal record ResendUserActivationCommand(string UserId) : IRequest<Result>;

internal class ResendUserActivationCommandValidator : AbstractValidator<ResendUserActivationCommand>
{
    public ResendUserActivationCommandValidator()
    {
        this.RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationError.EmptyId);
    }
}

internal class ResendUserActivationHandler : IRequestHandler<ResendUserActivationCommand, Result>
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

    public async Task<Result> Handle(ResendUserActivationCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));

        var user = await this.userRepository.Get(request.UserId, cancellationToken);
        if (user is null)
        {
            return Result.Failure(ProcessingError.UserNotFound);
        }

        if (user.Role != Role.UnverifiedMember)
        {
            return Result.Failure(ProcessingError.AccountAlreadyActivated);
        }

        var verification = new Verification()
        {
            Type = VerificationType.AccountActivation,
            Code = CodeGeneratorService.GetRandomNumericString(8), //TODO: ADD OPTIONS FOR Length and expiration..
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        };

        await this.userRepository.CreateVerification(user.Id, verification, cancellationToken);

        await this.mailService.SendAccountActivation(new VerificationMailDto
        {
            Username = user.Username,
            Email = user.Email,
            VerificationCode = verification.Code,
            VerificationUrl = this.urlGeneratorService.GetActivation(user.Id, verification.Code)
        }, cancellationToken);

        return Result.Success();
    }
}
