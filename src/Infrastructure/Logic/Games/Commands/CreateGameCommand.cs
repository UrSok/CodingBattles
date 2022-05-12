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

internal record CreateGameCommand(string UserId, bool isPrivate) : IRequest<Result<string>>;

internal class CreateGameCommandValidator : AbstractValidator<CreateGameCommand>
{
    public CreateGameCommandValidator()
    {
        this.RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationError.EmptyUserId);
    }
}

internal class CreateGameHandler : IRequestHandler<CreateGameCommand, Result>
{
    private readonly IGameRepository gamesRepository;

    public CreateGameHandler(IGameRepository gamesRepository)
    {
        this.gamesRepository = gamesRepository;
    }

    public async Task<Result> Handle(CreateGameCommand request, CancellationToken cancellationToken)
    {
        var game = new Game()
        {
            Code = CodeGeneratorService.GetRandomAlphanumericString(8),
            CreatedByUserId = request.UserId,
            IsPrivate = request.isPrivate,
        };

        var gameId = await this.gamesRepository.Create(game, cancellationToken);
        if (!string.IsNullOrEmpty(gameId))
        {
            return Result<string>.Failure(Error.InternalServerError);
        }

        return Result<string>.Success(gameId);
    }
}
