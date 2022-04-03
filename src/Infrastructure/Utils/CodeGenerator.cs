using System.Security.Cryptography;

namespace Infrastructure.Utils;

public static class CodeGenerator
{
    public static string GetRandomNumericString(int length)
    {
        const string numericCharacters =
            "0123456789";
        return GetRandomString(length, numericCharacters);
    }

    public static string GetRandomAlphanumericString(int length)
    {
        const string alphanumericCharacters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "abcdefghijklmnopqrstuvwxyz" +
            "0123456789";
        return GetRandomString(length, alphanumericCharacters);
    }

    private static string GetRandomString(int length, IEnumerable<char> characterSet)
    {
        if (length < 0)
            throw new ArgumentException("Length must not be negative", "length");
        if (length > int.MaxValue / 8) // 250 million chars ought to be enough for anybody
            throw new ArgumentException("Length is too big", "length");
        if (characterSet == null)
            throw new ArgumentNullException("characterSet");
        var characterArray = characterSet.Distinct().ToArray();
        if (characterArray.Length == 0)
            throw new ArgumentException("CharacterSet must not be empty", "characterSet");

        var bytes = RandomNumberGenerator.GetBytes(length * 8);
        var result = new char[length];
        ;
        for (int i = 0; i < length; i++)
        {
            ulong value = BitConverter.ToUInt64(bytes, i * 8);
            result[i] = characterArray[value % (uint)characterArray.Length];
        }
        return new string(result);
    }
}
