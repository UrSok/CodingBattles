namespace Domain.Models.Results;

public class TestResult
{
    public string Note { get; set; }
    public string Status { get; set; }
    public string BuildStdout { get; set; }
    public string BuildStderr { get; set; }
    public int? BuildExitCode { get; set; }
    public string BuildTime { get; set; }
    public int? BuildMemory { get; set; }
    public string BuildResult { get; set; }
    public string Stdout { get; set; }
    public string Stderr { get; set; }
    public int? ExitCode { get; set; }
    public string Time { get; set; }
    public string Memory { get; set; }
    public string Connections { get; set; }
    public string Result { get; set; }
}
