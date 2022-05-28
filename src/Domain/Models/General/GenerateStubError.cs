namespace Domain.Models.General;

public class GenerateStubError
{
    public int Line { get; set; }

    public string ValidationCode { get; set; }

    public string CulpritName { get; set; }
}
