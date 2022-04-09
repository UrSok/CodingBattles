using Ardalis.GuardClauses;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Results;
using Domain.Models.Users;
using Domain.Utils.MailDataModels;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Services.Cryptography;
using Infrastructure.Services.Generators;
using Infrastructure.Services.Mail;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Users.Commands;

internal record RegisterUserCommand(UserRegistrationModel UserRegistrationModel) : IRequest<Result>;

internal class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserCommandValidator()
    {

        this.RuleFor(x => x.UserRegistrationModel.Username)
            .MinimumLength(2).WithError(ValidationError.InvalidUsername);

        this.RuleFor(x => x.UserRegistrationModel.Email)
            .EmailAddress().WithError(ValidationError.InvalidEmail);

        this.RuleFor(x => x.UserRegistrationModel.Password)
            .NotEmpty().WithError(ValidationError.InvalidPassword);
        //.MinimumLength(6).WithError(ValidationError.InvalidPassword); TODO: Uncomment Password validation
    }
}

internal class RegisterUserHandler : IRequestHandler<RegisterUserCommand, Result>
{
    private readonly IUserRepository userRepository;
    private readonly IMailService mailService;
    private readonly IUrlGeneratorService urlGeneratorService;
    private readonly ICryptoService cryptoService;

    public RegisterUserHandler(
        IUserRepository userRepository,
        IMailService mailService,
        IUrlGeneratorService urlGeneratorService,
        ICryptoService cryptoService)
    {
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.urlGeneratorService = urlGeneratorService;
        this.cryptoService = cryptoService;
    }

    public async Task<Result> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));
        var normalizedEmail = request.UserRegistrationModel.Email.ToLowerInvariant();


        var existingUser = await this.userRepository
            .GetByEmail(normalizedEmail, cancellationToken);
        if (existingUser is not null)
        {
            return Result.Failure(ProcessingError.UserExists);
        }

        var newUser = this.GetNewUser(request.UserRegistrationModel);

        newUser.Verification = new Verification()
        {
            Type = VerificationType.AccountActivation,
            Code = CodeGeneratorService.GetRandomNumericString(8),
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        };

        var newUserId = await this.userRepository.Create(newUser, cancellationToken);

        await this.mailService.SendAccountActivation(new VerificationMailData
        {
            Username = newUser.Username,
            Email = newUser.Email,
            VerificationCode = newUser.Verification.Code,
            VerificationUrl = this.urlGeneratorService.GetActivation(newUserId, newUser.Verification.Code)
        }, cancellationToken);

        return Result.Success();
    }

    private User GetNewUser(UserRegistrationModel userRegistrationModel)
    {
        var dateTimeNow = DateTime.Now;
        var passwordSalt = this.cryptoService.GenerateSalt();
        var passwordHash = this.cryptoService.Compute(userRegistrationModel.Password, passwordSalt); ;

        var newUser = new User()
        {
            Username = userRegistrationModel.Username,
            Email = userRegistrationModel.Email.ToLowerInvariant(),
            Registered = dateTimeNow,
            Role = Role.UnverifiedMember,
            PasswordSalt = passwordSalt,
            PasswordHash = passwordHash
        };

        return newUser;
    }
}