using StubGenerator.StubInput.Models.Validation;

namespace StubGenerator.StubInput.Models;

public class Variable
{
    public string Name { get; set; }
    public string Type { get; set; }

    public Variable(string name, string type)
    {
        Name = name;
        Type = type;
    }
}

public class BadVariable : Variable
{
    public ValidationCode ValidationCode { get; set; }

    public BadVariable(ValidationCode validationCode, string name) : base(name, "")
    {
        ValidationCode = validationCode;
    }

    public BadVariable(ValidationCode validationCode, string name, string type) : base(name, type)
    {
        ValidationCode = validationCode;
        Type = type;
    }

}

public class TextVariable : Variable
{
    public int Length { get; set; }

    public TextVariable(string name, string type, int length) : base(name, type)
    {
        Length = length;
    }


}
