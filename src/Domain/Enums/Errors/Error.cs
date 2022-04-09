using Ardalis.SmartEnum;

namespace Domain.Enums.Errors;

public class Error : SmartEnum<Error>
{
    public static readonly Error InternalServerError =
        new(nameof(InternalServerError), 0);

    public static readonly Error DatabaseError =
        new(nameof(DatabaseError), 1);

    public Error(string name, int value) : base(name, value)
    {
    }
}
