# API Response Encryption

This system provides automatic compression and encryption of API responses to reduce data transfer size and improve security.

## Overview

- **Compression**: Uses gzip compression to reduce payload size
- **Encryption**: AES-256-GCM encryption for secure data transfer
- **Automatic**: Handles encryption/decryption transparently
- **Configurable**: Control which endpoints use encryption

## How It Works

### Backend (Smart Compression)
1. Client sends `X-Encrypted-Response: true` header
2. Backend compresses response data (gzip)
3. Backend encrypts compressed data (AES-256-GCM)
4. **🧠 Smart Decision**: Checks if encryption is beneficial
   - Must save ≥50 bytes AND ≥5% of original size
   - If not beneficial, sends original unencrypted data
   - If beneficial, sends encrypted response
5. Returns response with decision metadata

### Frontend (Automatic)
1. Detects encrypted responses automatically
2. Decrypts and decompresses data when needed
3. Logs smart compression decisions
4. Returns original data to application

## Performance Benefits

### Typical Compression Ratios
- **Dashboard data**: 60-80% size reduction
- **Network structure**: 70-85% size reduction  
- **Commission history**: 50-70% size reduction
- **Large JSON responses**: 40-90% size reduction

### Example Savings
```
Original: 45,230 bytes
Encrypted: 12,847 bytes  
Savings: 71.6% (32,383 bytes saved)
```

## Smart Compression

The system automatically decides whether to use encryption based on actual benefits:

### Decision Criteria (Backend)
- **Minimum Byte Savings**: Must save ≥50 bytes
- **Minimum Percentage**: Must save ≥5% of original size  
- **Both Required**: Must meet BOTH criteria to use encryption

### Example Decisions
```
✅ Large Response: 10,000B → 3,000B (70% reduction, 7,000B saved) → ENCRYPT
❌ Small Response: 200B → 180B (10% reduction, 20B saved) → DON'T ENCRYPT  
❌ Poor Compression: 1,000B → 980B (2% reduction, 20B saved) → DON'T ENCRYPT
❌ Size Increase: 100B → 150B (-50% reduction, -50B saved) → DON'T ENCRYPT
```

### Smart Headers
```
// When encryption is used
X-Response-Encrypted: true
X-Encryption-Reason: beneficial (saved 7000B, 70.0%)

// When encryption is skipped  
X-Response-Encrypted: false
X-Encryption-Skipped: insufficient-benefit
X-Encryption-Reason: <50B saved (saved only 20B, 10.0%)
```

## Configuration

### Enable/Disable Globally
```typescript
import { setEncryptionEnabled } from '@/lib/config/encryption.config';

// Disable encryption
setEncryptionEnabled(false);

// Enable encryption  
setEncryptionEnabled(true);
```

### Smart Compression Settings
```typescript
import { updateSmartCompression } from '@/lib/config/encryption.config';

// Adjust smart compression thresholds (backend config)
// Only encrypt if saves ≥50 bytes AND ≥5% of original size
updateSmartCompression({
  enabled: true,       // Enable intelligent compression decisions
  minSavings: 1,       // Minimum bytes to save (frontend only)
  logDecisions: true,  // Log compression decisions
});
```

### Configure Specific Endpoints
```typescript
import { updateEncryptionConfig } from '@/lib/config/encryption.config';

// Only encrypt specific endpoints
updateEncryptionConfig({
  endpoints: {
    include: ['/api/v1/dashboard', '/api/v1/network']
  }
});

// Exclude specific endpoints
updateEncryptionConfig({
  endpoints: {
    exclude: ['/auth/me', '/health']
  }
});
```

### Control Logging
```typescript
// Disable compression stats logging
updateEncryptionConfig({
  logStats: false
});
```

## Browser Compatibility

### Modern Browsers (Full Support)
- Chrome 80+
- Firefox 90+ 
- Safari 14+
- Edge 80+

**Features**: Full compression + encryption

### Older Browsers (Graceful Fallback)
- Encryption still works
- Compression may fallback to simple encoding
- No functionality loss

## Security

### Encryption Details
- **Algorithm**: AES-256-GCM
- **Key Size**: 256 bits
- **IV**: Random 16 bytes per request
- **Authentication**: Built-in auth tag
- **AAD**: Additional authenticated data

### Key Management
- Uses hardcoded key for demo (replace in production)
- Same key on frontend and backend
- Consider environment variables for production

### Security Headers
```
X-Response-Encrypted: true
X-Original-Size: 45230
X-Compressed-Size: 12847
X-Compression-Ratio: 71.6
```

## Monitoring

### Console Logs (when enabled)
```
// When encryption is used
🔓 Decrypting encrypted response...
📊 Smart compression: 45230B → 12847B (71.6% reduction, saved 32383B)
✅ Response decrypted successfully

// When encryption is skipped
🤔 Smart compression: Encryption skipped - <50B saved (200B → 180B, would save 20B)
```

### Backend Logs
```
// When encryption is used
[DEBUG] ✅ Smart compression: Using encryption - beneficial (saved 32383B, 71.6%) (45230B → 12847B)

// When encryption is skipped
[DEBUG] ❌ Smart compression: Skipping encryption - <50B saved (saved only 20B, 10.0%) (200B → 180B)
```

## Troubleshooting

### Common Issues

**1. Decryption Failed**
- Check if encryption keys match
- Verify response format
- Check browser compatibility

**2. No Compression**
- Small responses may not compress well
- Already compressed data won't improve
- Check if endpoint is excluded

**3. Performance Issues**
- Encryption adds ~10-50ms processing time
- Large responses benefit most
- Consider excluding small endpoints

### Debug Mode
```typescript
// Enable detailed logging
updateEncryptionConfig({
  logStats: true
});

// Check if endpoint should be encrypted
import { shouldEncryptEndpoint } from '@/lib/config/encryption.config';
console.log(shouldEncryptEndpoint('/api/v1/dashboard')); // true/false
```

## Production Considerations

### Environment Variables
```env
# Backend
ENCRYPTION_KEY=your-32-character-secret-key-here

# Frontend  
NEXT_PUBLIC_ENCRYPTION_ENABLED=true
NEXT_PUBLIC_ENCRYPTION_LOG_STATS=false
```

### Performance Tips
1. **Trust smart compression** - it automatically handles decisions
2. **Adjust thresholds** based on your data patterns
   - Increase `minByteSavings` for high-traffic APIs
   - Increase `minPercentSavings` for better selectivity
3. **Monitor compression ratios** and decision logs
4. **Use CDN caching** for both encrypted and unencrypted responses
5. **Consider HTTP/2 compression** as additional layer

### Smart Compression Tuning
```env
# Backend thresholds (adjust based on your needs)
MIN_BYTE_SAVINGS=50        # Default: 50 bytes
MIN_PERCENT_SAVINGS=5      # Default: 5%
SMART_COMPRESSION=true     # Default: enabled
```

### Security Best Practices
1. **Use environment variables** for keys
2. **Rotate keys** periodically
3. **Monitor for anomalies**
4. **Use HTTPS** (encryption is additional layer)
5. **Validate response integrity**

## API Usage

### Manual Control (Advanced)
```typescript
// Make request without encryption
const response = await apiRequest('/api/v1/small-data', {
  headers: {
    'X-Encrypted-Response': 'false'
  }
});

// Force encryption for specific request  
const response = await apiRequest('/api/v1/large-data', {
  headers: {
    'X-Encrypted-Response': 'true'
  }
});
``` 