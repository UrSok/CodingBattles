using StubGenerator.StubInput.Models;
using StubGenerator.StubOutput.Factory;
using StubGenerator.StubOutput.Models;

namespace StubGenerator.StubOutput;

public static class OutputParser
{
    public static string Parse(Language language, List<Statement> statements)
    {
        var generator = SyntaxFactory.Get(language);

        foreach (var statement in statements)
        {
            generator.AddStatement(statement);
        }

        return generator.GetGeneratedStub();
    }
}
