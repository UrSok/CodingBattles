using Domain.Enums.Errors;

namespace Domain.Models.Results;

public interface IDomainResult
{
    IEnumerable<Error> Errors { get; set; }

    bool IsSuccess { get; }
}

public class Result : IDomainResult
{
    public IEnumerable<Error> Errors { get; set; }

    public bool IsSuccess =>
        !Errors.Any();

    public Result()
    {
        Errors = new List<Error>();
    }

    public static Result Success()
    {
        return new();
    }

    public static Result Failure(Error error)
        => new() { Errors = new List<Error> { error } };

    public static Result Failure(IEnumerable<Error> errors)
        => new() { Errors = errors };
}

public class Result<T> : Result
{
    public T Value { get; set; }

    public static Result<T> Success(T value)
        => new() { Value = value };

    public static Result<T> Failure(T value, Error error)
        => new() { Value = value, Errors = new List<Error> { error } };

    public static new Result<T> Failure(Error error) 
        => new() { Errors = new List<Error> { error } };

    public static new Result<T> Failure(IEnumerable<Error> errors) 
        => new() { Errors = errors };
}
