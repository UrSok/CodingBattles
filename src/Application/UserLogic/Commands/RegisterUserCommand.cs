using Ardalis.GuardClauses;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Models.Common;
using Domain.Models.Responses;
using Domain.Models.Users;
using Domain.Repositories;
using Domain.Utils.MailDataModels;
using Infrastructure.Utils;
using Infrastructure.Utils.Cryptography;
using Infrastructure.Utils.Mail;
using MediatR;

namespace Application.UserLogic.Commands;

public record RegisterUserCommand(UserRegistrationModel UserRegistrationModel) : IRequest<BaseResponse>;

public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, BaseResponse>
{
    private readonly IUserRepository userRepository;
    private readonly IMailService mailService;
    private readonly IUrlGenerator urlGenerator;
    private readonly ICryptoService cryptoService;

    public RegisterUserHandler(
        IUserRepository userRepository,
        IMailService mailService,
        IUrlGenerator urlGenerator,
        ICryptoService cryptoService)
    {
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.urlGenerator = urlGenerator;
        this.cryptoService = cryptoService;
    }

    public async Task<BaseResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));

        var existingUser = await this.userRepository
            .GetByEmail(request.UserRegistrationModel.Email, cancellationToken);
        if (existingUser is not null)
        {
            return BaseResponse.Failure(ErrorCode.UserExists);
        }

        var newUser = this.GetNewUser(request.UserRegistrationModel);

        newUser.Verification = new Verification()
        {
            Type = VerificationType.AccountActivation,
            Code = CodeGenerator.GetRandomNumericString(8),
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        };

        var newUserId = await this.userRepository.Create(newUser, cancellationToken);

        await this.mailService.SendAccountActivation(new VerificationMailData
        {
            UserId = newUserId, 
            Username = newUser.Username, 
            Email = newUser.Email, 
            VerificationCode = newUser.Verification.Code
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
            IsEmailVerified = false,
            Registered = dateTimeNow,
            LastActive = dateTimeNow,
            Role = Role.Member,
            PasswordSalt = passwordSalt,
            PasswordHash = passwordHash
        };

        return newUser;
    }
}