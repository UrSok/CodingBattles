using Ardalis.GuardClauses;
using Domain.Enums;
using Domain.Models.Responses;
using Domain.Models.Users;
using Domain.Repositories;
using Infrastructure.Options;
using Infrastructure.Utils.Cryptography;
using MediatR;

namespace Application.AuthLogic.Commands;

public record AuthUserCommand(UserLoginModel UserLoginModel) : IRequest<BaseResponse<AuthResponse>>;

public class AuthUserHandler : IRequestHandler<AuthUserCommand, BaseResponse<AuthResponse>>
{
    private readonly IUserRepository userRepository;
    private readonly ICryptoService cryptoService;
    private readonly string key;

    public AuthUserHandler(IUserRepository userRepository, ICryptoService cryptoService, IJwtKeyOptions jwtKeyOptions)
    {
        this.userRepository = userRepository;
        this.cryptoService = cryptoService;
        this.key = jwtKeyOptions.Key;
    }

    public async Task<BaseResponse<AuthResponse>> Handle(AuthUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));

        var user = await this.userRepository.GetByEmail(request.UserLoginModel.Email, cancellationToken);

        if (user is null)
        {
            return BaseResponse<AuthResponse>.Failure(ErrorCode.IncorrectLoginOrPassword);
        }

        var passwordHash = cryptoService.Compute(request.UserLoginModel.Password, user.PasswordSalt);

        if (!cryptoService.Compare(passwordHash, user.PasswordHash))
        {
            return BaseResponse<AuthResponse>.Failure(ErrorCode.IncorrectLoginOrPassword);
        }

        //TODO: Logic for token
        //TODO: Session for activity

        var authResponse = new AuthResponse
        {
            Token = "fdsfds",
            User = user,
        };

        return BaseResponse<AuthResponse>.Success(authResponse);
    }
}