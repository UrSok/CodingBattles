using Domain.Enums;
using Domain.Models.Users;

namespace Domain.Models.Games.Results;


public class GetGameListResultItem
{
    public string Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public RoundStatus RoundStatus { get; set; }
    public List<UserModel> Users { get; set; }
}
