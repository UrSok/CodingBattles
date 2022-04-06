using Ardalis.GuardClauses;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Models.Responses;
using Domain.Models.Users;
using Domain.Utils.MailDataModels;
using Infrastructure.Repositories;
using Infrastructure.Services.Cryptography;
using Infrastructure.Services.Generators;
using Infrastructure.Services.Mail;
using MediatR;

namespace Infrastructure.Logic.Users.Commands;

internal record RegisterUserCommand(UserRegistrationModel UserRegistrationModel) : IRequest<BaseResponse>;

internal class RegisterUserHandler : IRequestHandler<RegisterUserCommand, BaseResponse>
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

    public async Task<BaseResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));

        var existingUser = await this.userRepository
            .GetByEmail(request.UserRegistrationModel.Email, cancellationToken); //TODO: CHECH IF MAIL IS CHECKED PROPERLY(IGNORE CASE)
        if (existingUser is not null)
        {
            return BaseResponse.Failure(ErrorCode.UserExists);
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

        return BaseResponse.Success();
    }

    private User GetNewUser(UserRegistrationModel userRegistrationModel)
    {
        var dateTimeNow = DateTime.Now;
        var passwordSalt = this.cryptoService.GenerateSalt();
        var passwordHash = this.cryptoService.Compute(userRegistrationModel.Password, passwordSalt); ;

        var newUser = new User()
        {
            Username = userRegistrationModel.Username,
            Email = userRegistrationModel.Email,
            Registered = dateTimeNow,
            Role = Role.UnverifiedMember,
            PasswordSalt = passwordSalt,
            PasswordHash = passwordHash
        };

        return newUser;
    }
}