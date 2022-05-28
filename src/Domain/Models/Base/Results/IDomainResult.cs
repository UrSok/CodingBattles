using Domain.Enums.Errors;

namespace Domain.Models.Common.Results;

public interface IDomainResult
{
    IEnumerable<Error> Errors { get; set; }

    bool IsSuccess { get; }
}
