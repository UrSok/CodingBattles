using Ardalis.GuardClauses;
using AutoMapper;
using Domain.Entities.Users;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using Domain.Models.Users.RequestsResults;
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

internal record AuthUserCommand(AuthUserRequest Model) : IRequest<Result<AuthUserResult>>;

internal class AuthUserCommandValidator : AbstractValidator<AuthUserCommand>
{
    public AuthUserCommandValidator()
    {
        this.RuleFor(x => x.Model.Email)
            .EmailAddress().WithError(ValidationError.InvalidEmail);

        this.RuleFor(x => x.Model.Password)
            .NotEmpty().WithError(ValidationError.InvalidPassword);
    }
}

internal class AuthUserHandler : IRequestHandler<AuthUserCommand, Result<AuthUserResult>>
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

    public async Task<Result<AuthUserResult>> Handle(AuthUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));
        var normalizedEmail = request.Model.Email.ToLowerInvariant();

        var user = await this.userRepository.GetByEmail(normalizedEmail, cancellationToken);

        if (user is null)
        {
            return Result<AuthUserResult>.Failure(ProcessingError.IncorrectLoginOrPassword);
        }

        var inputPasswordHash = this.cryptoService.Compute(request.Model.Password, user.PasswordSalt);
        if (!this.cryptoService.Compare(inputPasswordHash, user.PasswordHash))
        {
            return Result<AuthUserResult>.Failure(ProcessingError.IncorrectLoginOrPassword);
        }

        var tokenExpiresAt = DateTime.UtcNow.AddHours(24);
        var token = this.CreateToken(user.Id, user.Username, user.Email, user.Role, tokenExpiresAt);

        var session = new Session()
        {
            Token = token,
            ExpiresAt = tokenExpiresAt,
        };

        await this.userRepository.AddSession(user.Id, session, cancellationToken);

        var result = new AuthUserResult
        {
            AccessToken = token,
        };

        return Result<AuthUserResult>.Success(result);
    }

    private string CreateToken(string userId, string username, string email, string role, DateTime expiresAt)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenKey = Encoding.ASCII.GetBytes(this.key);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, userId),
                    new Claim(ClaimTypes.Name, username),
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