using StubGenerator.StubInput.Constants;
using StubGenerator.StubInput.Models;

namespace StubGenerator.StubOutput.Syntax;

internal static class JavaScriptSyntaxConsts
{
    public const string InputReplacer = "{input}";
    public const string StatementReplacer = "{statement}";
    public const string TypeReplacer = "{type}";
    public const string NameReplacer = "{name}";
    public const string OutputReplacer = "{output_replacer}";
    public const string ForLoopConditionValueReplacer = "{forloop_replacer}";
    public const string InputsVarName = "inputs";
    public const string DeclareInputsVar = $"var {InputsVarName}";
    public const string ConsoleReadLine = "readline()";
    public const string ConsoleReadLineWithSplit = $"{ConsoleReadLine}.split(' ')";

    public const string ForLoop = $"for(let i = 0; i < {ForLoopConditionValueReplacer}; i++)";
    public const string DeclareInputsVarWithEnd = $"var {InputsVarName};";
    public const string ConsoleLogWithEnd = $"console.log('{OutputReplacer}');";
    public const string StatementAssignmentWithEnd = $"const {NameReplacer} = {InputReplacer};";
    public const string StatementWithEnd = $"{StatementReplacer};";
    public const string DeclareInputsVarAndReadWithEnd = $"{DeclareInputsVar} = {ConsoleReadLineWithSplit};";
    public const string InputsVarReadWithEnd = $"{InputsVarName} = {ConsoleReadLineWithSplit};";
}

public class JavaScriptSyntax : BaseSyntax
{

    protected override string GetVariableAndInput(Variable variable)
    {
        string variableInput = variable.Type switch
        {
            VarTypeSyntax.Int => $"parseInt({JavaScriptSyntaxConsts.InputReplacer})",
            VarTypeSyntax.Float => $"parseFloat({JavaScriptSyntaxConsts.InputReplacer})",
            VarTypeSyntax.Bool => $"({JavaScriptSyntaxConsts.InputReplacer} === 'true')",
            VarTypeSyntax.String => JavaScriptSyntaxConsts.InputReplacer,
            VarTypeSyntax.Word => JavaScriptSyntaxConsts.InputReplacer,
            _ => throw new Exception("Unknown variable type!"),
        };

        return JavaScriptSyntaxConsts.StatementAssignmentWithEnd
            .Replace(JavaScriptSyntaxConsts.NameReplacer, variable.Name)
            .Replace(JavaScriptSyntaxConsts.InputReplacer, variableInput);
    }

    protected override void AddVariablesAndInputs(List<Variable> variables)
    {
        if (variables.Count == 1)
        {
            var variableAndInput = this.GetVariableAndInput(variables.First())
                .Replace(JavaScriptSyntaxConsts.InputReplacer, $"{JavaScriptSyntaxConsts.ConsoleReadLine}");

            this.AddLine(variableAndInput);

            return;
        }

        foreach (var (variable, index) in variables.Select((variable, index) => (variable, index)))
        {
            var variableAndInput = this.GetVariableAndInput(variable)
               .Replace(JavaScriptSyntaxConsts.InputReplacer, $"{JavaScriptSyntaxConsts.InputsVarName}[{index}]");

            this.AddLine(variableAndInput);
        }
    }

    protected override void AddInputStatement(InputStatement statement)
    {
        if (statement.Variables.Count > 1)
        {
            this.AddLine(JavaScriptSyntaxConsts.DeclareInputsVarAndReadWithEnd);
        }

        this.AddVariablesAndInputs(statement.Variables);
    }

    protected override void AddInputloopStatement(InputloopStatement statement)
    {

        var loopConditionValue = string.IsNullOrWhiteSpace(statement.LoopVariableName) ?
            statement.LoopNumber.ToString() : statement.LoopVariableName;

        var forLoop = JavaScriptSyntaxConsts.ForLoop
            .Replace(JavaScriptSyntaxConsts.ForLoopConditionValueReplacer, loopConditionValue);

        this.AddLine(forLoop + " {");
        this.ChangeTabsAmount(1, true);

        if (statement.Variables.Count > 1)
        {
            this.AddLine(JavaScriptSyntaxConsts.DeclareInputsVarAndReadWithEnd);
        }

        this.AddVariablesAndInputs(statement.Variables);

        this.ChangeTabsAmount(0, true);
        this.AddLine("}");
    }

    protected override void AddOutputStatement(OutputStatement statement)
    {
        var consoleLog = JavaScriptSyntaxConsts.ConsoleLogWithEnd
            .Replace(JavaScriptSyntaxConsts.OutputReplacer, statement.Text);

        this.AddLine(consoleLog);
    }
}
