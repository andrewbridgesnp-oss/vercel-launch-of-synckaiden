import crypto from 'crypto';

/**
 * AES-256-CBC Encryption Service for API Key Vault
 * 
 * This service provides secure encryption and decryption of sensitive data
 * using AES-256 in CBC mode with randomly generated initialization vectors.
 * 
 * Security features:
 * - AES-256-CBC encryption algorithm
 * - Random IV generation for each encryption operation
 * - Separate IV storage for decryption
 * - Uses environment-based master key
 */

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32; // 256 bits

/**
 * Get or generate the master encryption key from environment
 * In production, this should be a securely stored secret
 */
function getMasterKey(): Buffer {
  const keySource = process.env.ENCRYPTION_MASTER_KEY || process.env.JWT_SECRET || 'default-dev-key-change-in-production';
  
  // Derive a 32-byte key from the source using SHA-256
  return crypto.createHash('sha256').update(keySource).digest();
}

/**
 * Encrypt sensitive data (e.g., API keys, tokens)
 * 
 * @param plaintext - The sensitive data to encrypt
 * @returns Object containing encrypted data and IV
 */
export function encrypt(plaintext: string): { encrypted: string; iv: string } {
  try {
    const key = getMasterKey();
    
    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the data
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex')
    };
  } catch (error) {
    console.error('[Encryption] Failed to encrypt data:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt encrypted data
 * 
 * @param encrypted - The encrypted data (hex string)
 * @param ivHex - The initialization vector used during encryption (hex string)
 * @returns The decrypted plaintext
 */
export function decrypt(encrypted: string, ivHex: string): string {
  try {
    const key = getMasterKey();
    const iv = Buffer.from(ivHex, 'hex');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[Encryption] Failed to decrypt data:', error);
    throw new Error('Decryption failed');
  }
}

/**
 * Hash sensitive data for comparison (one-way)
 * Useful for storing hashed versions of secrets for verification
 * 
 * @param data - The data to hash
 * @returns SHA-256 hash of the data
 */
export function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate a secure random token
 * Useful for generating API keys, session tokens, etc.
 * 
 * @param length - Length of the token in bytes (default: 32)
 * @returns Hex-encoded random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Verify if a plaintext matches a hash
 * 
 * @param plaintext - The plaintext to verify
 * @param hashedValue - The hash to compare against
 * @returns True if the plaintext matches the hash
 */
export function verifyHash(plaintext: string, hashedValue: string): boolean {
  const computedHash = hash(plaintext);
  return crypto.timingSafeEqual(
    Buffer.from(computedHash),
    Buffer.from(hashedValue)
  );
}
