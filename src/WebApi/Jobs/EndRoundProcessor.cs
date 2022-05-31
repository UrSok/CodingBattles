using Application.Managers;
using WebApi.Schedulers;

namespace WebApi.Jobs;

public class EndRoundProcessor : AbstractCronScheduler
{
    private readonly IServiceProvider serviceProvider;
    private readonly IGameManager gameManager;

    public EndRoundProcessor(ICronScheduleConfig<EndRoundProcessor> config,
                             IServiceProvider serviceProvider, IGameManager gameManager)
            : base(config.CronExpression, config.TimeZoneInfo)
    {
        this.serviceProvider = serviceProvider;
        this.gameManager = gameManager;
    }

    public override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        var count = await this.gameManager.EndRoundsWithTimeInPast(cancellationToken);
        return;
    }
}
