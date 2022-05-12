using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Results;


namespace Domain.Models.Users;

public class UserModel
{
    public string Id { get; set; }
    public string Username { get; set; }
    public DateTime Registered { get; set; }

}
