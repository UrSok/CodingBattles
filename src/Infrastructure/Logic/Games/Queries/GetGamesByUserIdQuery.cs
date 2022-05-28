using AutoMapper;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Common.Results;
using Domain.Models.Games;
using Domain.Models.Users;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Queries;

internal record GetGamesByUserIdQuery(string UserId) : IRequest<Result<List<GameSearchItem>>>;

internal class GetGamesByUserIdQueryValidator : AbstractValidator<GetGamesByUserIdQuery>
{
    public GetGamesByUserIdQueryValidator()
    {
        this.RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationError.EmptyUserId);
    }
}

internal class GetGamesByUserIdHandler : IRequestHandler<GetGamesByUserIdQuery, Result<List<GameSearchItem>>>
{
    private readonly IGameRepository gameRepository;
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;

    public GetGamesByUserIdHandler(IGameRepository gameRepository, IUserRepository userRepository, IMapper mapper)
    {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public async Task<Result<List<GameSearchItem>>> Handle(GetGamesByUserIdQuery request, CancellationToken cancellationToken)
    {
        var games = await this.gameRepository.GetGamesByUserId(request.UserId, cancellationToken);
        var userIds = games.SelectMany(x => x.UserIds).ToList();
        var users = await this.userRepository.GetByIds(userIds, cancellationToken);
        var userDtos = this.mapper.Map<List<UserDto>>(users);

        var gameSearchItemList = games.Select((game) =>
        {
            var gameSearchItem = this.mapper.Map<GameSearchItem>(game);
            gameSearchItem.Users = userDtos.Where(user => game.UserIds.Contains(user.Id)).ToList();
            return gameSearchItem;
        }).ToList();

        return Result<List<GameSearchItem>>.Success(gameSearchItemList);
    }
}
