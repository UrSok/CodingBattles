using Domain.Enums;
using Domain.Models.Users;

namespace Domain.Models.Games.Results;

public class GameSearchItem
{
    public string Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public GameStatus Status { get; set; }
    public List<UserModel> Users { get; set; }
}
