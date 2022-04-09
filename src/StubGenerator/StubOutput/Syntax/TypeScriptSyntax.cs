using StubGenerator.StubInput.Constants;
using StubGenerator.StubInput.Models;

namespace StubGenerator.StubOutput.Syntax;

internal static class TypeScriptSyntaxConsts
{
    public const string InputReplacer = "{input}";
    public const string StatementReplacer = "{statement}";
    public const string TypeReplacer = "{type}";
    public const string NameReplacer = "{name}";
    public const string OutputReplacer = "{output_replacer}";
    public const string ForLoopConditionValueReplacer = "{forloop_replacer}";
    public const string InputsVarName = "inputs";
    public const string DeclareInputsVar = $"var {InputsVarName}: string[]";
    public const string ConsoleReadLine = "readline()";
    public const string ConsoleReadLineWithSplit = $"{ConsoleReadLine}.split(' ')";

    public const string ForLoop = $"for(let i = 0; i < {ForLoopConditionValueReplacer}; i++)";
    public const string DeclareInputsVarWithEnd = $"var {InputsVarName};";
    public const string ConsoleLogWithEnd = $"console.log('{OutputReplacer}');";
    public const string StatementAssignmentWithEnd = $"const {NameReplacer}: {TypeReplacer} = {InputReplacer};";
    public const string StatementWithEnd = $"{StatementReplacer};";
    public const string DeclareInputsVarAndReadWithEnd = $"{DeclareInputsVar} = {ConsoleReadLineWithSplit};";
    public const string InputsVarReadWithEnd = $"{InputsVarName} = {ConsoleReadLineWithSplit};";
}

public class TypeScriptSyntax : BaseSyntax
{
    private readonly Dictionary<string, string> variableTypesDictionary;

    public TypeScriptSyntax()
    {
        this.variableTypesDictionary = new Dictionary<string, string>
        {
            { VarTypeSyntax.Int,    "number" },
            { VarTypeSyntax.Float,  "number" },
            { VarTypeSyntax.Bool,   "bool" },
            { VarTypeSyntax.String, "string" },
            { VarTypeSyntax.Word,   "string" }
        };
    }

    protected override string GetVariableAndInput(Variable variable)
    {
        this.variableTypesDictionary.TryGetValue(variable.Type, out string variableType);

        string variableInput = variable.Type switch
        {
            VarTypeSyntax.Int => $"parseInt({TypeScriptSyntaxConsts.InputReplacer})",
            VarTypeSyntax.Float => $"parseFloat({TypeScriptSyntaxConsts.InputReplacer})",
            VarTypeSyntax.Bool => $"({TypeScriptSyntaxConsts.InputReplacer} === 'true')",
            VarTypeSyntax.String => TypeScriptSyntaxConsts.InputReplacer,
            VarTypeSyntax.Word => TypeScriptSyntaxConsts.InputReplacer,
            _ => throw new Exception("Unknown variable type!"),
        };

        return TypeScriptSyntaxConsts.StatementAssignmentWithEnd
            .Replace(TypeScriptSyntaxConsts.TypeReplacer, variableType)
            .Replace(TypeScriptSyntaxConsts.NameReplacer, variable.Name)
            .Replace(TypeScriptSyntaxConsts.InputReplacer, variableInput);
    }

    protected override void AddVariablesAndInputs(List<Variable> variables)
    {
        if (variables.Count == 1)
        {
            var variableAndInput = this.GetVariableAndInput(variables.First())
                .Replace(TypeScriptSyntaxConsts.InputReplacer, $"{TypeScriptSyntaxConsts.ConsoleReadLine}");

            this.AddLine(variableAndInput);

            return;
        }

        foreach (var (variable, index) in variables.Select((variable, index) => (variable, index)))
        {
            var variableAndInput = this.GetVariableAndInput(variable)
               .Replace(TypeScriptSyntaxConsts.InputReplacer, $"{TypeScriptSyntaxConsts.InputsVarName}[{index}]");

            this.AddLine(variableAndInput);
        }
    }

    protected override void AddInputStatement(InputStatement statement)
    {
        if (statement.Variables.Count > 1)
        {
            this.AddLine(TypeScriptSyntaxConsts.DeclareInputsVarAndReadWithEnd);
        }

        this.AddVariablesAndInputs(statement.Variables);
    }

    protected override void AddInputloopStatement(InputloopStatement statement)
    {

        var loopConditionValue = string.IsNullOrWhiteSpace(statement.LoopVariableName) ?
            statement.LoopNumber.ToString() : statement.LoopVariableName;

        var forLoop = TypeScriptSyntaxConsts.ForLoop
            .Replace(TypeScriptSyntaxConsts.ForLoopConditionValueReplacer, loopConditionValue);

        this.AddLine(forLoop + " {");
        this.ChangeTabsAmount(1, true);

        if (statement.Variables.Count > 1)
        {
            this.AddLine(TypeScriptSyntaxConsts.DeclareInputsVarAndReadWithEnd);
        }

        this.AddVariablesAndInputs(statement.Variables);

        this.ChangeTabsAmount(0, true);
        this.AddLine("}");
    }

    protected override void AddOutputStatement(OutputStatement statement)
    {
        var consoleLog = TypeScriptSyntaxConsts.ConsoleLogWithEnd
            .Replace(TypeScriptSyntaxConsts.OutputReplacer, statement.Text);

        this.AddLine(consoleLog);
    }
}
