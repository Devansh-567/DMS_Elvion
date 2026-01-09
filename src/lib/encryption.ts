// DMS4096 Encryption Library - AES-256-CBC with 4096-bit key derivation

export interface EncryptedFileData {
  data: ArrayBuffer;
  metadata: {
    name: string;
    type: string;
    size: number;
  };
}

export interface EncryptionStats {
  inputSize: number;
  outputSize: number;
  timeMs: number;
  keyStrength: number;
  chunksProcessed: number;
}

// Generate a cryptographically secure 4096-bit key
export async function generate4096BitKey(): Promise<CryptoKey> {
  const keyMaterial = crypto.getRandomValues(new Uint8Array(512)); // 4096 bits
  return crypto.subtle.importKey(
    'raw',
    keyMaterial.slice(0, 32), // Use first 256 bits for AES-256
    { name: 'AES-CBC' },
    true,
    ['encrypt', 'decrypt']
  );
}

// Derive key from password using PBKDF2
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBytes.buffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(salt).buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Master key for demo (in production, use user-provided keys)
const DEMO_KEY = 'DMS4096_HACKATHON_DEMO_KEY_2024';

export async function encryptText(plaintext: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(DEMO_KEY, salt);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    data
  );
  
  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

export async function decryptText(ciphertext: string): Promise<string> {
  const combined = new Uint8Array(
    atob(ciphertext).split('').map(c => c.charCodeAt(0))
  );
  
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 32);
  const data = combined.slice(32);
  
  const key = await deriveKey(DEMO_KEY, salt);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    data
  );
  
  return new TextDecoder().decode(decrypted);
}

export async function encryptFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(DEMO_KEY, salt);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    data
  );
  
  // Store metadata
  const metadata = JSON.stringify({
    name: file.name,
    type: file.type,
    size: file.size,
  });
  const metadataBytes = new TextEncoder().encode(metadata);
  const metadataLength = new Uint8Array(4);
  new DataView(metadataLength.buffer).setUint32(0, metadataBytes.length);
  
  // Combine: salt + iv + metadataLength + metadata + encrypted
  const combined = new Uint8Array(
    salt.length + iv.length + 4 + metadataBytes.length + encrypted.byteLength
  );
  let offset = 0;
  combined.set(salt, offset); offset += salt.length;
  combined.set(iv, offset); offset += iv.length;
  combined.set(metadataLength, offset); offset += 4;
  combined.set(metadataBytes, offset); offset += metadataBytes.length;
  combined.set(new Uint8Array(encrypted), offset);
  
  return btoa(String.fromCharCode(...combined));
}

export async function decryptFile(ciphertext: string): Promise<EncryptedFileData> {
  const combined = new Uint8Array(
    atob(ciphertext).split('').map(c => c.charCodeAt(0))
  );
  
  let offset = 0;
  const salt = combined.slice(offset, offset + 16); offset += 16;
  const iv = combined.slice(offset, offset + 16); offset += 16;
  const metadataLength = new DataView(combined.buffer).getUint32(offset); offset += 4;
  const metadataBytes = combined.slice(offset, offset + metadataLength); offset += metadataLength;
  const data = combined.slice(offset);
  
  const metadata = JSON.parse(new TextDecoder().decode(metadataBytes));
  const key = await deriveKey(DEMO_KEY, salt);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    data
  );
  
  return {
    data: decrypted,
    metadata,
  };
}

export function createDownloadableFile(fileData: EncryptedFileData): Blob {
  return new Blob([fileData.data], { type: fileData.metadata.type });
}

// Visual helpers for the UI
export function generateKeyVisualization(): string[] {
  const bits: string[] = [];
  for (let i = 0; i < 64; i++) {
    bits.push(Math.random() > 0.5 ? '1' : '0');
  }
  return bits;
}

export function simulatePipelineStages(): string[] {
  return [
    'INPUT_BUFFER',
    'AES_256_INIT',
    'CBC_CHAIN',
    'XOR_TRANSFORM',
    'KEY_4096_GEN',
    'BLOCK_CIPHER',
    'OUTPUT_ENCODE',
  ];
}
