using Newtonsoft.Json;

namespace Infrastructure.Services.Compiler.Models;

public static class PaizaJobInfoStatus {
    public static readonly string Running = "running";
    public static readonly string Completed = "completed";
}
public static class PaizaJobDetailsResult
{
    public static readonly string Error = "error";
    public static readonly string Failure = "failure";
    public static readonly string Timeout = "timeout";
    public static readonly string Success = "success";
}

public class PaizaJobInfo
{
    public string Id { get; set; }
    public string Status { get; set; }
}

public class PaizaJobDetails
{
    public string Id { get; set; }
    public string Language { get; set; }
    public string Note { get; set; }
    public string Status { get; set; }

    [JsonProperty("build_stdout")]
    public string BuildStdout { get; set; }

    [JsonProperty("build_stderr")]
    public string BuildStderr { get; set; }

    [JsonProperty("build_exit_code")]
    public int? BuildExitCode { get; set; }

    [JsonProperty("build_time")]
    public string BuildTime { get; set; }

    [JsonProperty("build_memory")]
    public int? BuildMemory { get; set; }

    [JsonProperty("build_result")]
    public string BuildResult { get; set; }

    [JsonProperty("stdout")]
    public string Stdout { get; set; }

    [JsonProperty("stderr")]
    public string Stderr { get; set; }

    [JsonProperty("exit_code")]
    public int? ExitCode { get; set; }

    public string Time { get; set; }
    public string Memory { get; set; }
    public string Connections { get; set; }
    public string Result { get; set; }
}
