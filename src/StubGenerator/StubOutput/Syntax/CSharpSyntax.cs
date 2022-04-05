using StubGenerator.StubInput.Constants;
using StubGenerator.StubInput.Models;

namespace StubGenerator.StubOutput.Syntax;

internal static class CSharpSyntaxConsts
{
    public const string InputReplacer = "{input}";
    public const string StatementReplacer = "{statement}";
    public const string TypeReplacer = "{type}";
    public const string NameReplacer = "{name}";
    public const string OutputReplacer = "{output_replacer}";
    public const string ForLoopConditionValueReplacer = "{forloop_replacer}";
    public const string InputsVarName = "inputs";
    public const string DeclareInputsVar = $"string[] {InputsVarName}";
    public const string ConsoleReadLine = "Console.ReadLine()";
    public const string ConsoleReadLineWithSplit = $"{ConsoleReadLine}.Split(' ')";

    public const string ForLoop = $"for(int i = 0; i < {ForLoopConditionValueReplacer}; i++)";
    public const string DeclareInputsVarWithEnd = $"string[] {InputsVarName};";
    public const string ConsoleWriteLineWithEnd = $"Console.WriteLine(\"{OutputReplacer}\");";
    public const string StatementAssignmentWithEnd = $"{TypeReplacer} {NameReplacer} = {InputReplacer};";
    public const string StatementWithEnd = $"{StatementReplacer};";
    public const string DeclareInputsVarAndReadWithEnd = $"{DeclareInputsVar} = {ConsoleReadLineWithSplit};";
    public const string InputsVarReadWithEnd = $"{InputsVarName} = {ConsoleReadLineWithSplit};";
}

public class CSharpSyntax : BaseSyntax
{
    private readonly Dictionary<string, string> variableTypesDictionary;
    private bool wasInputsDeclared;

    public CSharpSyntax()
    {
        this.variableTypesDictionary = new Dictionary<string, string>
        {
            { VarTypeSyntax.Int,    "int" },
            { VarTypeSyntax.Float,  "float" },
            { VarTypeSyntax.Bool,   "bool" },
            { VarTypeSyntax.String, "string" },
            { VarTypeSyntax.Word,   "string" }
        };

        this.wasInputsDeclared = false;
        this.GenerateBaseCode();
    }

    private void GenerateBaseCode()
    {
        this.AddLine("using System;");
        this.AddLine("using System.Linq;");
        this.AddLine("using System.IO;");
        this.AddLine("using System.Text;");
        this.AddLine("using System.Collections;");
        this.AddLine("using System.Collections.Generic;");
        this.AddLine("");
        this.AddLine("class Solution");
        this.AddLine("{");
        this.ChangeTabsAmount(+1);
        this.AddLine("static void Main()");
        this.AddLine("{");
        this.ChangeTabsAmount(+1);
    }

    protected override string GetVariableAndInput(Variable variable)
    {
        variableTypesDictionary.TryGetValue(variable.Type, out string variableType);

        string variableInput = variable.Type switch
        {
            VarTypeSyntax.Int => $"int.Parse({CSharpSyntaxConsts.InputReplacer})",
            VarTypeSyntax.Float => $"float.Parse({CSharpSyntaxConsts.InputReplacer})",
            VarTypeSyntax.Bool => $"bool.Parse({CSharpSyntaxConsts.InputReplacer})",
            VarTypeSyntax.String => CSharpSyntaxConsts.InputReplacer,
            VarTypeSyntax.Word => CSharpSyntaxConsts.InputReplacer,
            _ => throw new Exception("Unknown variable type!"),
        };

        return CSharpSyntaxConsts.StatementAssignmentWithEnd
            .Replace(CSharpSyntaxConsts.TypeReplacer, variableType)
            .Replace(CSharpSyntaxConsts.NameReplacer, variable.Name)
            .Replace(CSharpSyntaxConsts.InputReplacer, variableInput);
    }

    protected override void AddVariablesAndInputs(List<Variable> variables)
    {
        if (variables.Count == 1)
        {
            var variableAndInput = this.GetVariableAndInput(variables.First())
                .Replace(CSharpSyntaxConsts.InputReplacer, $"{CSharpSyntaxConsts.ConsoleReadLine}");

            this.AddLine(variableAndInput);

            return;
        }

        foreach (var (variable, index) in variables.Select((variable, index) => (variable, index)))
        {
            var variableAndInput = this.GetVariableAndInput(variable)
               .Replace(CSharpSyntaxConsts.InputReplacer, $"{CSharpSyntaxConsts.InputsVarName}[{index}]");

            this.AddLine(variableAndInput);
        }
    }

    protected override void AddInputStatement(InputStatement statement)
    {
        if (statement.Variables.Count > 1)
        {
            if (!this.wasInputsDeclared)
            {
                this.AddLine(CSharpSyntaxConsts.DeclareInputsVarAndReadWithEnd);
                this.wasInputsDeclared = true;
            }
            else
            {
                this.AddLine(CSharpSyntaxConsts.InputsVarReadWithEnd);
            }
        }

        this.AddVariablesAndInputs(statement.Variables);
    }

    protected override void AddInputloopStatement(InputloopStatement statement)
    {
        if (statement.Variables.Count > 1)
        {
            if (!this.wasInputsDeclared)
            {
                this.AddLine(CSharpSyntaxConsts.DeclareInputsVarWithEnd);
                this.wasInputsDeclared = true;
            }
        }

        var loopConditionValue = string.IsNullOrWhiteSpace(statement.LoopVariableName) ?
            statement.LoopNumber.ToString() : statement.LoopVariableName;

        var forLoop = CSharpSyntaxConsts.ForLoop
            .Replace(CSharpSyntaxConsts.ForLoopConditionValueReplacer, loopConditionValue);

        this.AddLine(forLoop);
        this.AddLine("{");
        this.ChangeTabsAmount(+1);

        if (statement.Variables.Count > 1)
        {
            this.AddLine(CSharpSyntaxConsts.InputsVarReadWithEnd);
        }

        this.AddVariablesAndInputs(statement.Variables);

        this.ChangeTabsAmount(-1);
        this.AddLine("}");
    }

    protected override void AddOutputStatement(OutputStatement statement)
    {
        //TODO: Parse special symbols?

        var consoleWriteLine = CSharpSyntaxConsts.ConsoleWriteLineWithEnd
            .Replace(CSharpSyntaxConsts.OutputReplacer, statement.Text);

        this.AddLine(consoleWriteLine);
    }

    public override string GetGeneratedStub()
    {
        this.ChangeTabsAmount(1, true);
        this.AddLine("}");
        this.ChangeTabsAmount(0);
        this.AddLine("}");
        return base.GetGeneratedStub();
    }
}
