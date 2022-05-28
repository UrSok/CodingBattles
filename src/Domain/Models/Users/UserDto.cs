using Domain.Enums.Errors;
using Domain.Models.Common;


namespace Domain.Models.Users;

public class UserDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string Role { get; set; }
}
