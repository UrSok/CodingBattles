using Ardalis.GuardClauses;
using AutoMapper;
using Domain.Entities.Users;
using Domain.Enums.Errors;
using Domain.Models.Results;
using Domain.Models.Users;
using FluentValidation;
using Infrastructure.Options;
using Infrastructure.Repositories;
using Infrastructure.Services.Cryptography;
using Infrastructure.Utils.Validation;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Logic.Users.Commands;

internal record AuthUserCommand(UserLoginModel UserLoginModel) : IRequest<Result<AuthResult>>;

internal class AuthUserCommandValidator : AbstractValidator<AuthUserCommand>
{
    public AuthUserCommandValidator()
    {
        this.RuleFor(x => x.UserLoginModel.Email)
            .EmailAddress().WithError(ValidationError.InvalidEmail);

        this.RuleFor(x => x.UserLoginModel.Password)
            .NotEmpty().WithError(ValidationError.InvalidPassword);
    }
}

internal class AuthUserHandler : IRequestHandler<AuthUserCommand, Result<AuthResult>>
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

    public async Task<Result<AuthResult>> Handle(AuthUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));
        var normalizedEmail = request.UserLoginModel.Email.ToLowerInvariant();

        var user = await this.userRepository.GetByEmail(normalizedEmail, cancellationToken);

        if (user is null)
        {
            return Result<AuthResult>.Failure(ProcessingError.IncorrectLoginOrPassword);
        }

        var inputPasswordHash = this.cryptoService.Compute(request.UserLoginModel.Password, user.PasswordSalt);
        if (!this.cryptoService.Compare(inputPasswordHash, user.PasswordHash))
        {
            return Result<AuthResult>.Failure(ProcessingError.IncorrectLoginOrPassword);
        }

        var tokenExpiresAt = DateTime.UtcNow.AddHours(24);
        var token = this.CreateToken(user.Id, user.Email, user.Role, tokenExpiresAt);

        var session = new Session()
        {
            Token = token,
            ExpiresAt = tokenExpiresAt,
        };

        await this.userRepository.AddSession(user.Id, session, cancellationToken);

        var authResult = new AuthResult
        {
            AccessToken = token,
            User = this.mapper.Map<AuthUserModel>(user),
        };

        return Result<AuthResult>.Success(authResult);
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