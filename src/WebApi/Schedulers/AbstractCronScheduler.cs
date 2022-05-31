using Cronos;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace WebApi.Schedulers
{
    public abstract class AbstractCronScheduler : IHostedService, IDisposable
    {
        private readonly CronExpression cronExpression;
        private readonly TimeZoneInfo timeZoneInfo;
        private Timer timer;
        private bool disposed;

        public AbstractCronScheduler(string expression, TimeZoneInfo timeZoneInfo)
        {
            cronExpression = ExpressionHelper.ParseExpression(expression);
            this.timeZoneInfo = timeZoneInfo;
        }

        public abstract Task ExecuteAsync(CancellationToken cancellationToken);

        public virtual async Task StartAsync(CancellationToken cancellationToken)
        {
            await SetupScheduler(cancellationToken);
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            if (timer != null)
            {
                StopTimer();
            }

            await Task.CompletedTask;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposed) return;
            if (disposing)
            {
                timer?.Dispose();
                disposed = true;
            }
        }

        protected virtual Task SetupScheduler(CancellationToken cancellationToken)
        {
            var nextTime = cronExpression.GetNextOccurrence(DateTimeOffset.Now, timeZoneInfo);

            if (nextTime.HasValue)
            {
                var delay = nextTime.Value - DateTimeOffset.Now;

                if (delay.TotalMilliseconds <= 0)
                    return SetupScheduler(cancellationToken);

                // setup event handler
                async void ElapsedCallback(object state)
                {
                    StopTimer();

                    if (!cancellationToken.IsCancellationRequested)
                        await ExecuteAsync(cancellationToken);

                    // reschedule next occurance
                    if (!cancellationToken.IsCancellationRequested)
                        await SetupScheduler(cancellationToken);
                }

                timer = new Timer(ElapsedCallback, null, delay, new TimeSpan(0, 0, 0, 0, -1));
            }

            return Task.CompletedTask;
        }

        private void StopTimer()
        {
            if (timer != null)
            {
                timer.Dispose();
                timer = null;
            }
        }
    }
}
