using StubGenerator.StubInput.Models.Validation;

namespace StubGenerator.StubInput.Models;

public class Statement
{
    public int LineNumber { get; set; }
    public string Keyword { get; set; }

    public Statement(string keyword)
    {
        Keyword = keyword;
    }
}

public class BadStatement : Statement
{
    public ValidationCode ValidationCode { get; set; }

    public BadStatement(ValidationCode validationCode, string keyword) : base(keyword)
    {
        ValidationCode = validationCode;
    }
}

public class OutputStatement : Statement
{
    public string? Text { get; set; }

    public OutputStatement(string keyword, string text) : base(keyword)
    {
        Text = text;
    }
}

public class InputStatement : Statement
{
    public string RawVariables { get; set; }

    public List<Variable> Variables { get; set; }

    public InputStatement(string keyword, string rawVariables) : base(keyword)
    {
        RawVariables = rawVariables;
        Variables = new List<Variable>();
    }
}

public class InputloopStatement : InputStatement
{
    public int? LoopNumber { get; set; }
    public string? LoopVariableName { get; set; }

    public InputloopStatement(string keyword, string rawVariables, string loopVariable) : base(keyword, rawVariables)
    {
        LoopVariableName = loopVariable;
    }

    public InputloopStatement(string keyword, string rawVariables, int loopNumber) : base(keyword, rawVariables)
    {
        LoopNumber = loopNumber;
    }
}
