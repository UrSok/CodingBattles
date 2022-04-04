using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Services.Cryptography;

internal class PBKDFCryptoService : ICryptoService
{
    public int HashIterations { get; }
    public int SaltSize { get; }

    public PBKDFCryptoService()
    {
        HashIterations = 100000;
        SaltSize = 34;
    }

    public bool Compare(string passwordHash1, string passwordHash2)
    {
        if (passwordHash1 == null || passwordHash2 == null)
            return false;

        var min_length = Math.Min(passwordHash1.Length, passwordHash2.Length);
        var result = 0;

        for (var i = 0; i < min_length; i++)
            result |= passwordHash1[i] ^ passwordHash2[i];

        return 0 == result;
    }

    public string Compute(string textToHash)
    {
        var salt = GenerateSalt();
        return Compute(textToHash, salt);
    }

    public string Compute(string textToHash, string salt)
    {
        return CalculateHash(textToHash, salt);
    }

    public string GenerateSalt()
    {
        var rand = RandomNumberGenerator.Create();
        var ret = new byte[SaltSize];
        rand.GetBytes(ret);
        return Convert.ToBase64String(ret);
    }

    private string CalculateHash(string textToHash, string salt)
    {
        var saltBytes = Encoding.UTF8.GetBytes(salt);

        var pbkdf2 = new Rfc2898DeriveBytes(textToHash, saltBytes, HashIterations);
        var key = pbkdf2.GetBytes(64);
        return Convert.ToBase64String(key);
    }
}
