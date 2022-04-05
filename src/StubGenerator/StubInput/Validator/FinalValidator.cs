using StubGenerator.StubInput.Constants;
using StubGenerator.StubInput.Models;
using StubGenerator.StubInput.Models.Validation;

namespace StubGenerator.StubInput.Validator;

public class FinalValidator
{
    private readonly List<Variable> globalScopeVars;
    private readonly List<Variable> vars;

    public FinalValidator()
    {
        this.globalScopeVars = new List<Variable>();
        this.vars = new List<Variable>();
    }

    private void AddVariable(Variable variable, bool globalScope)
    {
        if (globalScope)
        {
            this.globalScopeVars.Add(variable);
        }

        this.vars.Add(variable);
    }

    private Variable? GetVariable(string name, bool globalScopeOnly)
    {
        return globalScopeOnly
            ? this.globalScopeVars.FirstOrDefault(x => x.Name == name)
            : this.vars.FirstOrDefault(x => x.Name == name);
    }


    private ValidationCode ValidateVariables(List<Variable> newVariables, bool inLoop)
    {
        if (newVariables.Count > 1 && newVariables.Any(x => x.Type == VarTypeSyntax.String))
        {
            return FinalValidationCode.StringVariableShouldBeSingle;
        }

        var shouldSearchGlobalScopeOnly = inLoop;
        var shouldAddGlobalScope = !inLoop;

        foreach (var newVariable in newVariables)
        {
            var duplicate = this.GetVariable(newVariable.Name, shouldSearchGlobalScopeOnly);

            if (duplicate != null)
            {
                return FinalValidationCode.VariableAlreadyDeclared;
            }

            this.AddVariable(newVariable, shouldAddGlobalScope);
        }

        return ValidationCode.Valid;
    }

    private ValidationCode ValidateInputloopVariable(Variable? variable)
    {
        if (variable == null)
        {
            return FinalValidationCode.LoopVariableNotDeclared;
        }

        if (variable.Type != VarTypeSyntax.Int && variable.Type != VarTypeSyntax.Float)
        {
            return FinalValidationCode.LoopVariableTypeNotIntOrFloat;
        }

        return ValidationCode.Valid;
    }

    private ValidationCode ValidateInputloopStatement(InputloopStatement statement)
    {
        if (!string.IsNullOrWhiteSpace(statement.LoopVariableName))
        {
            var variable = this.GetVariable(statement.LoopVariableName, true);
            var validatorCode = this.ValidateInputloopVariable(variable);

            if (validatorCode != ValidationCode.Valid)
            {
                return validatorCode;
            }
        }

        return ValidateVariables(statement.Variables, true);
    }

    public ValidationCode Validate(Statement statement)
    {
        if (statement is InputloopStatement inputLoopStatement)
        {
            return ValidateInputloopStatement(inputLoopStatement);
        }

        if (statement is InputStatement inputStatement)
        {
            return ValidateVariables(inputStatement.Variables, false);
        }

        if (statement is OutputStatement)
        {
            return ValidationCode.Valid;
        }

        return ValidationCode.InvalidUnknown;
    }


}
