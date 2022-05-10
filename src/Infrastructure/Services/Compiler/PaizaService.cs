using Infrastructure.Services.Compiler.Models;
using Infrastructure.Utils;
using Newtonsoft.Json;
namespace Infrastructure.Services.Compiler;

public interface IPaizaService
{
    Task<PaizaJobDetails> Execute(string sourceCode, string language, string input, CancellationToken cancellationToken = default);
}

public class PaizaService : IPaizaService
{
    private async Task<PaizaJobDetails> GetPaizaJobDetails(string id, CancellationToken cancellationToken = default)
    {
        var values = new Dictionary<string, string>
        {
            { "api_key", "guest" },
            { "id", id },
        };


        PaizaJobDetails jobDetails = null;
        do
        {
            var content = new FormUrlEncodedContent(values);
            var request = new HttpRequestMessage(HttpMethod.Get, "http://api.paiza.io/runners/get_details");
            request.Content = content;
            var response = await Singleton.HttpClient
                .SendAsync(request, cancellationToken);

            var responseString = await response.Content.ReadAsStringAsync(cancellationToken);

            jobDetails = JsonConvert.DeserializeObject<PaizaJobDetails>(responseString);
            await Task.Delay(3);
        } while (jobDetails?.Status != PaizaJobInfoStatus.Completed);

        return jobDetails;
    }

    public async Task<PaizaJobDetails> Execute(string sourceCode, string language, string input, CancellationToken cancellationToken = default)
    {
        var values = new Dictionary<string, string>
        {
            { "api_key", "guest" },
            { "source_code", sourceCode },
            { "language", language },
            { "input", input }
        };

        var content = new FormUrlEncodedContent(values);

        var response = await Singleton.HttpClient
            .PostAsync("http://api.paiza.io/runners/create", content, cancellationToken);

        var responseString = await response.Content.ReadAsStringAsync(cancellationToken);

        var jobInfo = JsonConvert.DeserializeObject<PaizaJobInfo>(responseString);

        if (jobInfo is null || jobInfo.Id is null) { 
            return null;
        }

        await Task.Delay(1500);
        return await GetPaizaJobDetails(jobInfo.Id, cancellationToken);
    }


}
