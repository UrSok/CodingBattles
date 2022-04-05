using StubGenerator.StubInput.Models.Validation;

namespace StubGenerator.StubInput.Models;

public class InputParserResult
{
    public List<Statement> Statements { get; set; }
    public ValidationCode ValidationCode { get; set; }

    public InputParserResult()
    {
        ValidationCode = ValidationCode.Valid;
        Statements = new List<Statement>();
    }

    public static InputParserResult GetInvalidResultWithCode(ValidationCode validationCode, Statement statement)
    {
        var result = new InputParserResult();

        result.ValidationCode = validationCode;
        result.Statements.Add(statement);

        return result;
    }
}
