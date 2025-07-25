// Encryption configuration for the frontend
export interface EncryptionConfig {
  enabled: boolean;
  endpoints: {
    include?: string[];  // Specific endpoints to encrypt (if empty, encrypt all)
    exclude?: string[];  // Endpoints to exclude from encryption
  };
  logStats: boolean;     // Whether to log compression statistics
  smartCompression: {
    enabled: boolean;    // Whether to use smart compression (skip if not beneficial)
    minSavings: number;  // Minimum bytes saved to use encryption (default: 1)
    logDecisions: boolean; // Whether to log compression decisions
  };
}

// Default configuration
export const encryptionConfig: EncryptionConfig = {
  enabled: true,         // Enable encryption by default
  endpoints: {
    // Include specific endpoints (empty means all endpoints)
    include: [],
    
    // Exclude specific endpoints from encryption
    exclude: [
      '/auth/me',         // Small responses don't benefit from compression
      '/health',          // Health checks
      // Note: Admin login now handled by smart compression
    ],
  },
  logStats: true,        // Log compression stats for monitoring
  smartCompression: {
    enabled: true,       // Enable smart compression by default
    minSavings: 1,       // Must save at least 1 byte to use encryption
    logDecisions: true,  // Log compression decisions
  },
};

/**
 * Check if an endpoint should use encryption
 */
export function shouldEncryptEndpoint(endpoint: string): boolean {
  if (!encryptionConfig.enabled) {
    return false;
  }

  // If specific endpoints are included, only encrypt those
  if (encryptionConfig.endpoints.include && encryptionConfig.endpoints.include.length > 0) {
    return encryptionConfig.endpoints.include.some(pattern => endpoint.includes(pattern));
  }

  // If no include list, encrypt all except excluded ones
  if (encryptionConfig.endpoints.exclude && encryptionConfig.endpoints.exclude.length > 0) {
    return !encryptionConfig.endpoints.exclude.some(pattern => endpoint.includes(pattern));
  }

  // Default: encrypt everything
  return true;
}

/**
 * Update encryption configuration at runtime
 */
export function updateEncryptionConfig(updates: Partial<EncryptionConfig>): void {
  Object.assign(encryptionConfig, updates);
  console.log('🔧 Encryption config updated:', encryptionConfig);
}

/**
 * Enable/disable encryption globally
 */
export function setEncryptionEnabled(enabled: boolean): void {
  encryptionConfig.enabled = enabled;
  console.log(`🔒 Encryption ${enabled ? 'enabled' : 'disabled'} globally`);
}

/**
 * Get current compression stats logging setting
 */
export function shouldLogStats(): boolean {
  return encryptionConfig.logStats;
}

/**
 * Update smart compression settings
 */
export function updateSmartCompression(settings: Partial<typeof encryptionConfig.smartCompression>): void {
  Object.assign(encryptionConfig.smartCompression, settings);
  console.log('🧠 Smart compression config updated:', encryptionConfig.smartCompression);
}

/**
 * Enable/disable smart compression decisions logging
 */
export function setSmartCompressionLogging(enabled: boolean): void {
  encryptionConfig.smartCompression.logDecisions = enabled;
  console.log(`📊 Smart compression logging ${enabled ? 'enabled' : 'disabled'}`);
} 