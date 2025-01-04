import { createHash } from 'crypto';

// Function to generate a 10-character string from a SHA-256 hash
export const random = (input: any): string => {
  const hash = createHash('sha256');
  hash.update(input);
  const fullHash = hash.digest('hex');  // Get the full SHA-256 hash
  return fullHash.slice(0, 10); // Return only the first 10 characters
};

