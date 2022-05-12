using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;
internal record LeaveGameCommand(string UserId, string GameId) : IRequest<Result>;

internal class LeaveGameCommandValidator : AbstractValidator<LeaveGameCommand>
{
    public LeaveGameCommandValidator()
    {
        this.RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationError.EmptyUserId);

        this.RuleFor(x => x.GameId)
            .NotEmpty().WithError(ValidationError.EmptyGameId);
    }
}

internal class LeaveGameHandler : IRequestHandler<LeaveGameCommand, Result>
{
    private readonly IGameRepository gameRepository;

    public LeaveGameHandler(IGameRepository gameRepository)
    {
        this.gameRepository = gameRepository;
    }

    public async Task<Result> Handle(LeaveGameCommand request, CancellationToken cancellationToken)
    {
        var result = await this.gameRepository.RemoveFromGame(request.UserId, request.GameId, cancellationToken);
        
        if (!result)
        {
            return Result.Failure(Error.InternalServerError);
        }

        return Result.Success();
    }
}
