using Domain.Enums;

namespace Domain.Models.General.RequestsResults;

public class GenerateStubRequest
{
    public string Language { get; set; }
    public string Input { get; set; }
}

public class GenerateStubResult
{
    public string Stub { get; set; }

    public GenerateStubError Error { get; set; }
}
