using Newtonsoft.Json;

namespace Infrastructure.Services.Mail;

internal class GoogleToken
{
    [JsonProperty("access_token")]
    public string AccessToken { get; set; }

    [JsonProperty("expires_in")]
    public double ExpiresIn { get; set; }
    public DateTime ExpiresAt { get; set; }

    internal bool IsExpired
    {
        get
        {
            var expiresAtTimeSpan = new TimeSpan(ExpiresAt.Ticks);
            var utcNowTimeSpan = new TimeSpan(DateTime.UtcNow.Ticks);

            if (expiresAtTimeSpan.TotalSeconds - utcNowTimeSpan.TotalSeconds < 3)
            {
                return true;
            }

            return false;
        }
    }

    internal void GenerateExpiresAt()
    {
        ExpiresAt = DateTime.UtcNow.AddSeconds(ExpiresIn);
    }
}
