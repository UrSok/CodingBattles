﻿using AutoMapper;
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

internal record GetGamesByUserIdQuery(string UserId) : IRequest<Result<List<GetGameListResultItem>>>;

internal class GetGamesByUserIdQueryValidator : AbstractValidator<GetGamesByUserIdQuery>
{
    public GetGamesByUserIdQueryValidator()
    {
        this.RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationError.EmptyUserId);
    }
}

internal class GetGamesByUserIdHandler : IRequestHandler<GetGamesByUserIdQuery, Result<List<GetGameListResultItem>>>
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

    public async Task<Result<List<GetGameListResultItem>>> Handle(GetGamesByUserIdQuery request, CancellationToken cancellationToken)
    {
        var games = await this.gameRepository.GetGamesByUserId(request.UserId, cancellationToken);
        var userIds = games.SelectMany(x => x.UserIds).ToList();
        var users = await this.userRepository.GetByIds(userIds, cancellationToken);
        var userModels = this.mapper.Map<List<UserModel>>(users);

        var getGameListResult = this.mapper.Map<List<GetGameListResultItem>>(games);

        for (int i = 0; i < getGameListResult.Count; i++)
        {
            getGameListResult[i].Users = userModels.Where(x => games.ElementAt(i).UserIds.Contains(x.Id)).ToList();
            getGameListResult[i].RoundStatus = games.ElementAt(i).Rounds.LastOrDefault().Status;
        }

        return Result<List<GetGameListResultItem>>.Success(getGameListResult);
    }
}