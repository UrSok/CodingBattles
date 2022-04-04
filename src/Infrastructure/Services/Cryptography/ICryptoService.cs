namespace Infrastructure.Services.Cryptography;

internal interface ICryptoService
{
    /// <summary>
    /// Gets or sets the number of iterations the hash will go through
    /// </summary>
    int HashIterations { get; }

    /// <summary>
    /// Gets or sets the size of salt that will be generated if no Salt was set
    /// </summary>
    int SaltSize { get; }

    /// <summary>
    /// Compute the hash using default generated salt. Will Generate a salt if non was assigned
    /// </summary>
    /// <param name="textToHash"></param>
    /// <returns></returns>
    string Compute(string textToHash);

    /// <summary>
    /// Compute the hash that will utilize the passed salt
    /// </summary>
    /// <param name="textToHash">The text to be hashed</param>
    /// <param name="salt">The salt to be used in the computation</param>
    /// <returns>the computed hash: HashedText</returns>
    string Compute(string textToHash, string salt);

    /// <summary>
    /// Generates a salt with default salt size and iterations
    /// </summary>
    /// <returns>the generated salt</returns>
    string GenerateSalt();

    /// <summary>
    /// Compare the passwords for equality
    /// <param name="passwordHash1">The first password hash to compare</param>
    /// <param name="passwordHash2">The second password hash to compare</param>
    /// <returns>true: indicating the password hashes are the same, false otherwise.</param>
    bool Compare(string passwordHash1, string passwordHash2);
}
