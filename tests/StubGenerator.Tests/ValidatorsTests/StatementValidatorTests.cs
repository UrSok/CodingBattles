using NUnit.Framework;
using StubGenerator.StubInput.Constants;
using StubGenerator.StubInput.Models.Validation;
using StubGenerator.StubInput.Validator;

namespace StubGenerator.Tests.ValidatorsTests;

public class StatementValidatorTests
{
    [TestCase("blabla")]
    [TestCase("blabgfdgfdgfdla v")]
    [TestCase("Inputloop v")]
    [TestCase("iNpUt")]
    [TestCase("OUTPUT v")]
    public void ShouldReturnInvalidKeyword(string statement)
    {
        var validationCode = StatementValidator.Validate(statement);

        Assert.AreEqual(StatementValidationCode.KeywordInvalid, validationCode);
    }

    [Test]
    public void OutputShouldReturnTextMissing()
    {
        var statement = KeywordSyntax.Output;

        var validationCode = StatementValidator.Validate(statement);

        Assert.AreEqual(StatementValidationCode.TextMissing, validationCode);
    }

    [Test]
    public void InputShouldReturnVariablesMissing()
    {
        var statement = KeywordSyntax.Input;

        var validationCode = StatementValidator.Validate(statement);

        Assert.AreEqual(StatementValidationCode.VariablesMissing, validationCode);
    }

    [Test]
    public void InputloopShouldReturnLoopValueMissing()
    {
        var statement = KeywordSyntax.Inputloop;

        var validationCode = StatementValidator.Validate(statement);

        Assert.AreEqual(StatementValidationCode.LoopValueMissing, validationCode);
    }

    [TestCase($"{KeywordSyntax.Inputloop} 255")]
    [TestCase($"{KeywordSyntax.Inputloop} ivan")]
    public void InputloopShouldReturnLoopVariablesMissing(string statement)
    {
        var validationCode = StatementValidator.Validate(statement);

        Assert.AreEqual(StatementValidationCode.LoopVariablesMissing, validationCode);
    }

    [TestCase($"{KeywordSyntax.Inputloop} 255 v:int")]
    [TestCase($"{KeywordSyntax.Inputloop} 255 v:int vr:int")]
    [TestCase($"{KeywordSyntax.Inputloop} n v:int")]
    [TestCase($"{KeywordSyntax.Inputloop} n v:int vr:int")]
    [TestCase($"{KeywordSyntax.Input} v:int")]
    [TestCase($"{KeywordSyntax.Input} v:int vr:int")]
    [TestCase($"{KeywordSyntax.Output} vasea")]
    [TestCase($"{KeywordSyntax.Output} v s e a")]
    public void ShouldReturnValid(string statement)
    {
        var validationCode = StatementValidator.Validate(statement);

        Assert.AreEqual(ValidationCode.Valid, validationCode);
    }
}
