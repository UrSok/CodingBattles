﻿using Domain.Enums;
using Domain.Models.Users;

namespace Domain.Models.Games;

public class GameSearchItem
{
    public string Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public bool IsPrivate { get; set; }
    public GameStatus Status { get; set; }
    public List<UserDto> Users { get; set; }
}
