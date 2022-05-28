using Ardalis.GuardClauses;
using Domain.Entities.Users;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Users.Commands;

internal record ActivateUserCommand(string UserId, string VerificationCode) : IRequest<Result>;

internal class ActivateUserCommandValidator : AbstractValidator<ActivateUserCommand>
{
    public ActivateUserCommandValidator()
    {
        this.RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationError.EmptyId);

        this.RuleFor(x => x.VerificationCode)
            .Length(8).WithError(ValidationError.InvalidVerificationCode);
    }
}

internal class ActivateUserHandler : IRequestHandler<ActivateUserCommand, Result>
{
    private readonly IUserRepository userRepository;

    public ActivateUserHandler(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public async Task<Result> Handle(ActivateUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(request));

        var user = await this.userRepository.Get(request.UserId, cancellationToken);
        if (user is null)
        {
            return Result.Failure(ProcessingError.UserNotFound);
        }

        if (user.Verification.Type != VerificationType.AccountActivation
            || request.VerificationCode != user.Verification.Code)
        {
            return Result.Failure(ProcessingError.BadVerificationCode);
        }

        if (user.Verification is null)
        {
            return Result.Failure(ProcessingError.NoVerificationCode);
        }

        if (user.Verification.HasExpired)
        {
            return Result.Failure(ProcessingError.VerificationCodeExpired);
        }

        await this.userRepository.ActivateUser(user.Id, Role.Member, cancellationToken);

        return Result.Success();
    }
}
