using Autofac;
using FluentValidation;

namespace Infrastructure.Utils;

public class AutofacValidatorFactory : ValidatorFactoryBase
{
    private readonly IComponentContext context;

    public AutofacValidatorFactory(IComponentContext context)
    {
        this.context = context;
    }

    public override IValidator CreateInstance(Type validatorType)
    {
        if (this.context.TryResolve(validatorType, out var instance))
        {
            var validator = instance as IValidator;
            return validator;
        }

        return null;
    }
}
