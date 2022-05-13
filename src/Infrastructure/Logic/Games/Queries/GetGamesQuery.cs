using AutoMapper;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Games.Results;
using Domain.Models.Results;
using Domain.Models.Users;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Queries;
internal record GetGamesQuery() : IRequest<Result<List<GetGameListResultItem>>>;

internal class GetGamesQueryValidator : AbstractValidator<GetGamesQuery>
{
    public GetGamesQueryValidator()
    {

    }
}

internal class GetGamesHandler : IRequestHandler<GetGamesQuery, Result<List<GetGameListResultItem>>>
{
    private readonly IGameRepository gameRepository;
    private readonly IUserRepository userRepository;
    private readonly IMapper mapper;

    public GetGamesHandler(IGameRepository gameRepository, IUserRepository userRepository, IMapper mapper)
    {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public async Task<Result<List<GetGameListResultItem>>> Handle(GetGamesQuery request, CancellationToken cancellationToken)
    {
        var games = await this.gameRepository.Get(cancellationToken);
        var userIds = games.SelectMany(x => x.UserIds).ToList();
        var users = await this.userRepository.GetByIds(userIds, cancellationToken);
        var userModels = this.mapper.Map<List<UserModel>>(users);

        var getGameListResult = this.mapper.Map<List<GetGameListResultItem>>(games);

        for (int i = 0; i < getGameListResult.Count; i++)
        {
            getGameListResult[i].Users = userModels.Where(x => games.ElementAt(i).UserIds.Contains(x.Id)).ToList();
            getGameListResult[i].RoundStatus = games.ElementAt(i).Rounds.LastOrDefault()?.Status ?? Domain.Enums.RoundStatus.NotStarted;
        }

        return Result<List<GetGameListResultItem>>.Success(getGameListResult);
    }
}
