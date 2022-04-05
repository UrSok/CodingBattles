using NUnit.Framework;
using StubGenerator.StubInput.Models.Validation;
using StubGenerator.StubInput.Validator;

namespace StubGenerator.Tests.ValidatorsTests;

public class VarValidatorTests
{
    [TestCase("123v:int")]
    [TestCase("?-123v:int")]
    [TestCase("123v")]
    [TestCase("var-int?")]
    public void ShouldReturnNameInvalid(string variable)
    {
        var validationCode = VarValidator.Validate(variable);

        Assert.AreEqual(VarValidationCode.NameInvalid, validationCode);
    }

    [Test]
    public void ShouldReturnTypeMissing()
    {
        var variable = "var";

        var validationCode = VarValidator.Validate(variable);

        Assert.AreEqual(VarValidationCode.TypeMissing, validationCode);
    }

    [TestCase("v:intuger")]
    [TestCase("v:var")]
    [TestCase("v:v")]
    public void ShouldReturnTypeInvalid(string variable)
    {
        var validationCode = VarValidator.Validate(variable);

        Assert.AreEqual(VarValidationCode.TypeInvalid, validationCode);
    }

    [TestCase("v:string")]
    [TestCase("v:word")]
    public void ShouldReturnLengthMissing(string variable)
    {
        var validationCode = VarValidator.Validate(variable);

        Assert.AreEqual(VarValidationCode.LengthMissing, validationCode);
    }

    [TestCase("v:string.")]
    [TestCase("v:word.")]
    [TestCase("v:string.-a2")]
    [TestCase("v:word._aaa")]
    public void ShouldReturnLengthInvalid(string variable)
    {
        var validationCode = VarValidator.Validate(variable);

        Assert.AreEqual(VarValidationCode.LengthInvalid, validationCode);
    }

    [TestCase("v:string.9999999999999999999999999999999999999999999999")]
    [TestCase("v:word.9999999999999999999999999999999999999999999999")]
    public void ShouldReturnLengthOverflow(string variable)
    {
        var validationCode = VarValidator.Validate(variable);

        Assert.AreEqual(VarValidationCode.LengthOverflow, validationCode);
    }

    [TestCase("v:string.0")]
    [TestCase("v:word.0")]
    public void ShouldReturnLengthNegativeOrZero(string variable)
    {
        var validationCode = VarValidator.Validate(variable);

        Assert.AreEqual(VarValidationCode.LengthNegativeOrZero, validationCode);
    }

    [TestCase("v:int.0")]
    [TestCase("v:float.0")]
    [TestCase("v:bool.0")]
    [TestCase("v:int.a")]
    [TestCase("v:float.a")]
    [TestCase("v:bool.a")]
    [TestCase("v:int.100")]
    [TestCase("v:float.100")]
    [TestCase("v:bool.100")]
    public void ShouldReturnLengthNotNeeded(string variable)
    {
        var validationCode = VarValidator.Validate(variable);

        Assert.AreEqual(VarValidationCode.LengthNotNeeded, validationCode);
    }

    [TestCase("_v:int")]
    [TestCase("v123:float")]
    [TestCase("v1v_vvv:bool")]
    [TestCase("v123:string.1")]
    [TestCase("v123:word.23")]
    public void ShouldReturnValid(string variable)
    {
        var validationCode = VarValidator.Validate(variable);

        Assert.AreEqual(ValidationCode.Valid, validationCode);
    }
}
