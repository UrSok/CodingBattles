namespace StubGenerator.StubInput.Constants;

public static class KeywordSyntax
{
    public const string Input = "input";
    public const string Inputloop = "inputloop";
    public const string Output = "output";
}

public static class VarTypeSyntax
{
    public const string Int = "int";
    public const string Float = "float";
    public const string Bool = "bool";
    public const string String = "string";
    public const string Word = "word";
}

public static class DelimiterSyntax
{
    public const char LoopTimesAndValue = ' ';
    public const char StatementAndValue = ' ';
    public const char Var = ' ';
    public const char VarNameAndType = ':';
    public const char VarTypeAndLength = '.';
}

public static class PositionSyntax
{
    public const int StatementKeyword = 0;
    public const int StatementValue = 1;
    public const int StatementLoopValue = 0;
    public const int StatementLoopVariables = 1;
    public const int VarName = 0;
    public const int VarType = 1;
    public const int VarTypeLength = 0;
    public const int VarLength = 1;
}
