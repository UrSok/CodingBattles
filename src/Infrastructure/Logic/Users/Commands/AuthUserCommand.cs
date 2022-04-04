using Ardalis.GuardClauses;
using AutoMapper;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Models.Responses;
using Domain.Models.Users;
using Infrastructure.Options;
using Infrastructure.Repositories;
using Infrastructure.Services.Cryptography;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Logic.Users.Commands;

internal record AuthUserCommand(UserLoginModel UserLoginModel) : IRequest<BaseResponse<AuthResponse>>;

internal class AuthUserHandler : IRequestHandler<AuthUserCommand, BaseResponse<AuthResponse>>
{
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;
    private readonly ICryptoService cryptoService;
    private readonly string key;

    public AuthUserHandler(
        IUserRepository userRepository,
        IMapper mapper,
        ICryptoService cryptoService,
        IJwtKeyOptions jwtKeyOptions)
    {
        this.userRepository = userRepository;
        this.mapper = mapper;
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

        var inputPasswordHash = this.cryptoService.Compute(request.UserLoginModel.Password, user.PasswordSalt);
        if (!this.cryptoService.Compare(inputPasswordHash, user.PasswordHash))
        {
            return BaseResponse<AuthResponse>.Failure(ErrorCode.IncorrectLoginOrPassword);
        }

        var tokenExpiresAt = DateTime.UtcNow.AddHours(24);
        var token = this.CreateToken(user.Id, user.Email, user.Role, tokenExpiresAt);

        var session = new Session()
        {
            Token = token,
            ExpiresAt = tokenExpiresAt,
        };

        await this.userRepository.AddSession(user.Id, session, cancellationToken);

        var authResponse = new AuthResponse
        {
            AccessToken = token,
            User = this.mapper.Map<AuthUserModel>(user),
        };

        return BaseResponse<AuthResponse>.Success(authResponse);
    }

    private string CreateToken(string userId, string email, string role, DateTime expiresAt)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenKey = Encoding.ASCII.GetBytes(this.key);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, userId),
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.Role, role)
            }),
            Expires = expiresAt,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(tokenKey),
                SecurityAlgorithms.HmacSha256)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}