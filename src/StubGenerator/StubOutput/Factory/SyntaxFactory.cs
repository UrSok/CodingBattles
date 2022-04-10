using StubGenerator.StubOutput.Models;
using StubGenerator.StubOutput.Syntax;

namespace StubGenerator.StubOutput.Factory;

public static class SyntaxFactory
{
    public static BaseSyntax Get(Language language)
    {
        BaseSyntax syntax = null;

        language
            .When(Language.CSharp).Then(() => { syntax = new CSharpSyntax(); })
            .When(Language.JavaScript).Then(() => { syntax = new JavaScriptSyntax(); })
            .When(Language.TypeScript).Then(() => { syntax = new TypeScriptSyntax(); })
            .Default(() => throw new Exception("Unknown Language!"));

        return syntax;
    }
}
