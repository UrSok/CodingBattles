using Ardalis.GuardClauses;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Models.Common;
using Domain.Models.Responses;
using Domain.Models.Users;
using Domain.Repositories;
using Infrastructure.Utils.Cryptography;
using Infrastructure.Utils.Mail;
using MediatR;

namespace Application.UserLogic.Commands;

public record RegisterUserCommand(UserRegistrationModel UserRegistrationModel) : IRequest<BaseResponse>;

public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, BaseResponse>
{
    private readonly IUserRepository userRepository;
    private readonly IInfrastructureRepository infrastructureRepository;
    private readonly IMailService mailService;
    private readonly ICryptoService cryptoService;

    public RegisterUserHandler(
        IUserRepository userRepository, 
        IInfrastructureRepository infrastructureRepository, 
        IMailService mailService,
        ICryptoService cryptoService)
    {
        this.userRepository = userRepository;
        this.infrastructureRepository = infrastructureRepository;
        this.mailService = mailService;
        this.cryptoService = cryptoService;
    }

    public async Task<BaseResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));

        var existingUser = await userRepository
            .GetByEmail(request.UserRegistrationModel.Email, cancellationToken);
        if (existingUser is not null)
        {
            return BaseResponse.Failure(ErrorCode.UserExists);
        }

        var newUser = this.GetNewUser(request.UserRegistrationModel);
        await this.userRepository.Insert(newUser, cancellationToken);

        var mailTemplate = await this.infrastructureRepository
            .GetTemplateByCode(MailTemplateCode.AccountVerification, cancellationToken);

        //TODO: LOGIC TO GENERATE THE CODE

        await this.mailService.Send(new MailRequest()
        {
            Recipient = request.UserRegistrationModel.Email,
            Subject = mailTemplate.Subject,
            Body = string.Format(mailTemplate.Body, request.UserRegistrationModel.Username, "4546", "link:4546"), //TODO: GENERATE THE LINK AND THE CODE
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