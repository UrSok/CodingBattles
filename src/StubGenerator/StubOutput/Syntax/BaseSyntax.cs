using StubGenerator.StubInput.Models;

namespace StubGenerator.StubOutput.Syntax;

public abstract class BaseSyntax
{
    private List<string> generatedStubLines;
    private int tabsAmount;

    public BaseSyntax()
    {
        this.generatedStubLines = new List<string>();
        tabsAmount = 0;
    }

    protected void AddLine(string line)
        => this.generatedStubLines.Add($"{new string('\t', tabsAmount)}{line}");

    protected void ChangeTabsAmount(int operation, bool set = false) // 0 -> reset, -1 -> decrease, 1 -> increase
    {
        if (set || operation == 0)
        {
            this.tabsAmount = operation >= 0
                ? operation : 0;
            return;
        }

        this.tabsAmount += operation;

        if (this.tabsAmount < 0)
        {
            this.tabsAmount = 0;
        }
    }

    protected abstract string GetVariableAndInput(Variable variable);

    protected abstract void AddVariablesAndInputs(List<Variable> variables);

    protected abstract void AddInputStatement(InputStatement statement);

    protected abstract void AddInputloopStatement(InputloopStatement statement);

    protected abstract void AddOutputStatement(OutputStatement statement);

    public void AddStatement(Statement statement)
    {
        if (statement is OutputStatement outputStatement)
        {
            this.AddOutputStatement(outputStatement);
        }
        else if (statement is InputloopStatement inputloopStatement)
        {
            this.AddInputloopStatement(inputloopStatement);
        }
        else if (statement is InputStatement inputStatement)
        {
            this.AddInputStatement(inputStatement);
        }
    }

    public virtual string GetGeneratedStub()
        => string.Join('\n', this.generatedStubLines);
}
