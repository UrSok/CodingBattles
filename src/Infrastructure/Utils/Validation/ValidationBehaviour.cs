using Domain.Enums.Errors;
using Domain.Models.Results;
using FluentValidation;
using MediatR;

namespace Infrastructure.Utils.Validation;

internal class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse> where TResponse : IDomainResult, new()
{
    private readonly IEnumerable<IValidator<TRequest>> validators;

    public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators)
    {
        this.validators = validators;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken
                 cancellationToken, RequestHandlerDelegate<TResponse> next)
    {
        if (this.validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);

            var validationResults = await Task.WhenAll(this.validators.Select(v =>
                v.ValidateAsync(context, cancellationToken)));

            var failures = validationResults.SelectMany(r => r.Errors).Where(f =>
                f != null).ToList();

            if (failures.Any())
            {
                var validationErrors = new List<Error>();
                foreach (var failure in failures)
                {
                    ValidationError.TryFromName(failure.ErrorCode, out Error error);
                    error ??= ValidationError.UnspecifiedError;
                    validationErrors.Add(error);
                }

                var result = new TResponse()
                {
                    Errors = validationErrors
                };

                return result;
            }
        }

        return await next();
    }
}
