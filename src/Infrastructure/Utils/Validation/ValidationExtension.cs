using Domain.Enums.Errors;
using FluentValidation;

namespace Infrastructure.Utils.Validation;

internal static class ValidationExtension
{
    /// <summary>
    /// Registers the validation error name to ErrorCode propery of ValidationFailure
    /// </summary>
    public static IRuleBuilderOptions<T, TProperty> WithError<T, TProperty>(this IRuleBuilderOptions<T, TProperty> rule, ValidationError error)
    {
        rule.WithErrorCode(error.Name);
        return rule;
    }
}
