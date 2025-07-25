// Frontend encryption utilities using Web Crypto API
// This matches the backend encryption implementation

// Hardcoded encryption key (same as backend)
const ENCRYPTION_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; // 32 chars = 256 bits

export interface EncryptedResponse {
  data: string;
  iv: string;
  tag: string;
  compressed: boolean;
}

/**
 * Convert hex string to Uint8Array
 */
function hexToUint8Array(hexString: string): Uint8Array {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Decompress gzipped data using CompressionStream API (if available) or fallback
 */
async function decompress(compressedData: Uint8Array): Promise<string> {
  try {
    // Use CompressionStream API if available (modern browsers)
    if (typeof DecompressionStream !== 'undefined') {
      const decompressedStream = new DecompressionStream('gzip');
      const writer = decompressedStream.writable.getWriter();
      const reader = decompressedStream.readable.getReader();
      
      writer.write(compressedData);
      writer.close();
      
      const chunks: Uint8Array[] = [];
      let done = false;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }
      
      const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        decompressed.set(chunk, offset);
        offset += chunk.length;
      }
      
      return new TextDecoder().decode(decompressed);
    } else {
      // Fallback for older browsers - try to decode as-is
      console.warn('DecompressionStream not supported, attempting direct decode');
      return new TextDecoder().decode(compressedData);
    }
  } catch (error) {
    console.error('Decompression error:', error);
    // Final fallback - try to decode as-is
    return new TextDecoder().decode(compressedData);
  }
}

/**
 * Decrypt and decompress API response data
 * @param encryptedResponse - The encrypted response from the backend
 * @returns Decrypted and decompressed original data
 */
export async function decryptResponse(encryptedResponse: EncryptedResponse): Promise<any> {
  try {
    const { data, iv, tag, compressed } = encryptedResponse;
    
    // 1. Convert hex strings to Uint8Arrays
    const encryptedData = hexToUint8Array(data);
    const ivBytes = hexToUint8Array(iv);
    const tagBytes = hexToUint8Array(tag);
    
    // 2. Import the encryption key
    const keyBuffer = new TextEncoder().encode(ENCRYPTION_KEY);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // 3. Prepare data for decryption (encrypted data + auth tag)
    const encryptedWithTag = new Uint8Array(encryptedData.length + tagBytes.length);
    encryptedWithTag.set(encryptedData);
    encryptedWithTag.set(tagBytes, encryptedData.length);
    
    // 4. Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBytes,
        additionalData: new TextEncoder().encode('api-response')
      },
      cryptoKey,
      encryptedWithTag
    );
    
    const decryptedData = new Uint8Array(decryptedBuffer);
    
    // 5. Decompress if compressed
    let jsonString: string;
    if (compressed) {
      jsonString = await decompress(decryptedData);
    } else {
      jsonString = new TextDecoder().decode(decryptedData);
    }
    
    // 6. Parse JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Frontend decryption error:', error);
    throw new Error('Failed to decrypt response');
  }
}

/**
 * Check if a response is encrypted
 */
export function isEncryptedResponse(response: any): response is EncryptedResponse {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.data === 'string' &&
    typeof response.iv === 'string' &&
    typeof response.tag === 'string' &&
    typeof response.compressed === 'boolean'
  );
}

/**
 * Simple compression for client-side data (if needed)
 * Uses CompressionStream API if available
 */
export async function compress(data: string): Promise<Uint8Array> {
  try {
    if (typeof CompressionStream !== 'undefined') {
      const compressedStream = new CompressionStream('gzip');
      const writer = compressedStream.writable.getWriter();
      const reader = compressedStream.readable.getReader();
      
      writer.write(new TextEncoder().encode(data));
      writer.close();
      
      const chunks: Uint8Array[] = [];
      let done = false;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }
      
      const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        compressed.set(chunk, offset);
        offset += chunk.length;
      }
      
      return compressed;
    } else {
      // Fallback for older browsers
      return new TextEncoder().encode(data);
    }
  } catch (error) {
    console.error('Compression error:', error);
    return new TextEncoder().encode(data);
  }
} 