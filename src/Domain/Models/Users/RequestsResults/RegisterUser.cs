﻿namespace Domain.Models.Users.RequestsResults;

public class RegisterUserRequest
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}