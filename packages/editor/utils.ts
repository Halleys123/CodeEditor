const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_--';

export function generateSecureToken(length: number = 16): string {
  if (length <= 0) {
    return '';
  }

  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  const tokenChars: string[] = [];
  for (let i = 0; i < length; i += 1) {
    const index = randomValues[i] % ALPHABET.length;
    tokenChars.push(ALPHABET[index]);
  }

  return tokenChars.join('');
}
