using Domain.Entities.Games;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Services.Generators;
using Infrastructure.Utils.Validation;
using MediatR;
using System;

namespace Infrastructure.Logic.Games.Commands;

internal record CreateGameCommand(string UserId, string Name, bool IsPrivate) : IRequest<Result<string>>;

internal class CreateGameCommandValidator : AbstractValidator<CreateGameCommand>
{
    public CreateGameCommandValidator()
    {
        this.RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationError.EmptyUserId);
    }
}

internal class CreateGameHandler : IRequestHandler<CreateGameCommand, Result<string>>
{
    private readonly IGameRepository gameRepository;

    public CreateGameHandler(IGameRepository gameRepository)
    {
        this.gameRepository = gameRepository;
    }

    public async Task<Result<string>> Handle(CreateGameCommand request, CancellationToken cancellationToken)
    {
        var game = new Game()
        {
            Code = CodeGeneratorService.GetRandomAlphanumericString(8),
            Name = request.Name,
            GameMasterUserId = request.UserId,
            IsPrivate = request.IsPrivate,
            UserIds = new List<string> { request.UserId },
        };

        var gameId = await this.gameRepository.Create(game, cancellationToken);
        if (string.IsNullOrEmpty(gameId))
        {
            return Result<string>.Failure(Error.InternalServerError);
        }

        return Result<string>.Success(gameId);
    }
}
