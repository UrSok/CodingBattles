using Ardalis.GuardClauses;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace WebApi.Schedulers
{
    public static class CronServiceExtensions
    {
        public static IServiceCollection AddCronScheduler<T>(this IServiceCollection services, Action<ICronScheduleConfig<T>> options) where T : AbstractCronScheduler
        {
            Guard.Against.Null(options, $"Please provide configurations for {nameof(CronServiceExtensions)}");
            var config = new CronScheduleConfig<T>();
            options.Invoke(config);

            Guard.Against.NullOrWhiteSpace(config.CronExpression, $"Empty CronExpression is not allowed for {nameof(CronScheduleConfig<T>.CronExpression)}");
            services.AddSingleton<ICronScheduleConfig<T>>(config);
            services.AddHostedService<T>();

            return services;
        }
    }
}
