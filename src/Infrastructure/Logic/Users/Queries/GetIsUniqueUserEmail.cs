﻿using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Users.Queries;

internal record GetIsUniqueUserEmailQuery(string Email) : IRequest<Result>;

internal class GetIsUniqueUserEmailQueryValidator : AbstractValidator<GetIsUniqueUserEmailQuery>
{
    public GetIsUniqueUserEmailQueryValidator()
    {
        this.RuleFor(x => x.Email)
            .EmailAddress().WithError(ValidationError.InvalidEmail);
    }
}

internal class GetIsUniqueUserEmailHandler : IRequestHandler<GetIsUniqueUserEmailQuery, Result>
{
    private readonly IUserRepository userRepository;

    public GetIsUniqueUserEmailHandler(IUserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    public async Task<Result> Handle(GetIsUniqueUserEmailQuery request, CancellationToken cancellationToken)
    {
        var user = await this.userRepository.GetByEmail(request.Email, cancellationToken);
        if (user is not null)
        {
            return Result.Failure(ProcessingError.UserExists);
        }

        return Result.Success();
    }
}
