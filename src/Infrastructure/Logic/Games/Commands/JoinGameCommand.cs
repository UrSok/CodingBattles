using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;
internal record JoinGameCommand(string UserId, string Code) : IRequest<Result<string>>;

internal class JoinGameCommandValidator : AbstractValidator<JoinGameCommand>
{
    public JoinGameCommandValidator()
    {
        this.RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationError.EmptyUserId);

        this.RuleFor(x => x.Code)
            .Length(8).WithError(ValidationError.InvalidCode)
            .NotEmpty().WithError(ValidationError.InvalidCode);
    }
}

internal class JoinGameHandler : IRequestHandler<JoinGameCommand, Result<string>>
{
    private readonly IGameRepository gameRepository;

    public JoinGameHandler(IGameRepository gameRepository)
    {
        this.gameRepository = gameRepository;
    }

    public async Task<Result<string>> Handle(JoinGameCommand request, CancellationToken cancellationToken)
    {

        var game = await this.gameRepository.GetGameByCode(request.Code, cancellationToken);
        if (game is null)
        {
            return Result<string>.Failure(ProcessingError.GameNotFound);
        }

        var result = await this.gameRepository.AddUser(request.UserId, game.Id, cancellationToken);
        if (!result)
        {
            return Result<string>.Failure(Error.InternalServerError);
        }
        return Result<string>.Success(game.Id);
    }
}
