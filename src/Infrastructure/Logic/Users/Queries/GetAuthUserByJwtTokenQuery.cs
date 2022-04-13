using AutoMapper;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Results;
using Domain.Models.Users;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Users.Queries;
internal record GetAuthUserByJwtTokenQuery(string JwtToken) : IRequest<Result<AuthUserModel>>;

internal class GetAuthUserByJwtTokenQueryValidator : AbstractValidator<GetAuthUserByJwtTokenQuery>
{
    public GetAuthUserByJwtTokenQueryValidator()
    {
        this.RuleFor(x => x.JwtToken)
            .NotEmpty().WithError(ValidationError.EmptyJwtToken);
    }
}

internal class GetAuthUserByJwtTokenHandler : IRequestHandler<GetAuthUserByJwtTokenQuery, Result<AuthUserModel>>
{
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;

    public GetAuthUserByJwtTokenHandler(IUserRepository userRepository, IMapper mapper)
    {
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public async Task<Result<AuthUserModel>> Handle(GetAuthUserByJwtTokenQuery request, CancellationToken cancellationToken)
    {
        var user = await this.userRepository.GetByJwtToken(request.JwtToken, cancellationToken);
        if (user is null)
        {
            return Result<AuthUserModel>.Failure(ProcessingError.UserSessionExpired);
        }

        return Result<AuthUserModel>.Success(this.mapper.Map<AuthUserModel>(user));
    }
}
