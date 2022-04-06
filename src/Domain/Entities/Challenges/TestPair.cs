namespace Domain.Entities.Challenges;

public class TestPair
{
    public string Title { get; set; }

    public TestCase Case { get; set; }

    public TestCase Validator { get; set; }
}
