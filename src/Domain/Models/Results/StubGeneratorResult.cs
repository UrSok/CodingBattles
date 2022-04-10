namespace Domain.Models.Results;

public class StubGeneratorError
{
    public int Line { get; set; }

    public string ValidationCode { get; set; }

    public string CulpritName { get; set; }
}

public class StubGeneratorResult
{
    public string Stub { get; set; }

    public StubGeneratorError Error { get; set; }
}
