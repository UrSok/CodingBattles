namespace Infrastructure.Options;

internal interface IJwtKeyOptions
{
    string Key { get; set; }
}

public class JwtKeyOptions : IJwtKeyOptions
{
    public string Key { get; set; }
}
