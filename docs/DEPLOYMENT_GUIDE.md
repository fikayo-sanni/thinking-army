# Deployment Guide

## Overview

This guide covers deployment strategies, environment configuration, and DevOps practices for the Gamescoin Frontend application.

## Deployment Options

### 1. Static Site Deployment (Recommended)

The application is configured for static export, making it suitable for various hosting platforms.

#### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Or use GitHub integration
# Connect your repository to Vercel for automatic deployments
```

**vercel.json Configuration:**
```json
{
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "@api-url",
      "NEXT_PUBLIC_AUTHORITY_URL": "@authority-url",
      "NEXT_PUBLIC_CLIENT_ID": "@client-id"
    }
  },
  "env": {
    "NEXT_PUBLIC_API_URL": "https://reports.backend.gamescoin.com/",
    "NEXT_PUBLIC_AUTHORITY_URL": "https://your-authority.com",
    "NEXT_PUBLIC_CLIENT_ID": "your-client-id"
  }
}
```

#### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=out
```

**netlify.toml Configuration:**
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NEXT_PUBLIC_API_URL = "https://reports.backend.gamescoin.com/"
  NEXT_PUBLIC_AUTHORITY_URL = "https://your-authority.com"
  NEXT_PUBLIC_CLIENT_ID = "your-client-id"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### AWS S3 + CloudFront

```bash
# Build the application
npm run build

# Sync to S3 bucket
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 2. Docker Deployment

#### Dockerfile for Production

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AUTHORITY_URL
ARG NEXT_PUBLIC_CLIENT_ID
ARG NEXT_PUBLIC_REDIRECT_URI
ARG NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_AUTHORITY_URL=$NEXT_PUBLIC_AUTHORITY_URL
ENV NEXT_PUBLIC_CLIENT_ID=$NEXT_PUBLIC_CLIENT_ID
ENV NEXT_PUBLIC_REDIRECT_URI=$NEXT_PUBLIC_REDIRECT_URI
ENV NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=$NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI

# Build the application
RUN npm run build

# Production image, copy all the files and run nginx
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/out .
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    keepalive_timeout 65;

    # Gzip compression
    gzip on;
    gzip_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        application/xml+rss
        text/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";
    }
}
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_AUTHORITY_URL: ${NEXT_PUBLIC_AUTHORITY_URL}
        NEXT_PUBLIC_CLIENT_ID: ${NEXT_PUBLIC_CLIENT_ID}
        NEXT_PUBLIC_REDIRECT_URI: ${NEXT_PUBLIC_REDIRECT_URI}
        NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI: ${NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI}
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.frontend.tls=true"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"

  # Optional: Reverse proxy with SSL
  traefik:
    image: traefik:v2.9
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=your-email@domain.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./acme.json:/acme.json
    restart: unless-stopped
```

## Environment Configuration

### Environment Variables

#### Production Environment (.env.production)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://reports.backend.gamescoin.com/

# OIDC Configuration
NEXT_PUBLIC_AUTHORITY_URL=https://auth.gamescoin.com
NEXT_PUBLIC_CLIENT_ID=gamescoin-frontend-prod
NEXT_PUBLIC_REDIRECT_URI=https://app.gamescoin.com
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=https://app.gamescoin.com
NEXT_PUBLIC_RESPONSE_TYPE=code
NEXT_PUBLIC_SCOPE=openid profile email
NEXT_PUBLIC_LOAD_USER_INFO=true

# Application Configuration
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_VERSION=1.0.0
```

#### Staging Environment (.env.staging)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://reports.staging.gamescoin.com/

# OIDC Configuration
NEXT_PUBLIC_AUTHORITY_URL=https://auth.staging.gamescoin.com
NEXT_PUBLIC_CLIENT_ID=gamescoin-frontend-staging
NEXT_PUBLIC_REDIRECT_URI=https://staging.gamescoin.com
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=https://staging.gamescoin.com

# Application Configuration
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_VERSION=1.0.0-staging
```

#### Development Environment (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/

# OIDC Configuration
NEXT_PUBLIC_AUTHORITY_URL=https://auth.dev.gamescoin.com
NEXT_PUBLIC_CLIENT_ID=gamescoin-frontend-dev
NEXT_PUBLIC_REDIRECT_URI=http://localhost:5005
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=http://localhost:5005

# Development Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_VERSION=1.0.0-dev
```

### Environment Validation

```typescript
// lib/config/env-validation.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('Invalid API URL'),
  NEXT_PUBLIC_AUTHORITY_URL: z.string().url('Invalid Authority URL'),
  NEXT_PUBLIC_CLIENT_ID: z.string().min(1, 'Client ID is required'),
  NEXT_PUBLIC_REDIRECT_URI: z.string().url('Invalid Redirect URI'),
  NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI: z.string().url('Invalid Post Logout URI'),
  NEXT_PUBLIC_RESPONSE_TYPE: z.string().default('code'),
  NEXT_PUBLIC_SCOPE: z.string().default('openid profile email'),
  NEXT_PUBLIC_LOAD_USER_INFO: z.string().default('true'),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
  NEXT_PUBLIC_VERSION: z.string().optional(),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_AUTHORITY_URL: process.env.NEXT_PUBLIC_AUTHORITY_URL,
  NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
  NEXT_PUBLIC_REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI,
  NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI,
  NEXT_PUBLIC_RESPONSE_TYPE: process.env.NEXT_PUBLIC_RESPONSE_TYPE,
  NEXT_PUBLIC_SCOPE: process.env.NEXT_PUBLIC_SCOPE,
  NEXT_PUBLIC_LOAD_USER_INFO: process.env.NEXT_PUBLIC_LOAD_USER_INFO,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,
})

// Usage in app
console.log('Environment:', env.NEXT_PUBLIC_APP_ENV)
console.log('API URL:', env.NEXT_PUBLIC_API_URL)
```

## CI/CD Pipelines

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    strategy:
      matrix:
        environment: 
          - name: staging
            branch: staging
          - name: production
            branch: main

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets[format('API_URL_{0}', matrix.environment.name)] }}
          NEXT_PUBLIC_AUTHORITY_URL: ${{ secrets[format('AUTHORITY_URL_{0}', matrix.environment.name)] }}
          NEXT_PUBLIC_CLIENT_ID: ${{ secrets[format('CLIENT_ID_{0}', matrix.environment.name)] }}
          NEXT_PUBLIC_REDIRECT_URI: ${{ secrets[format('REDIRECT_URI_{0}', matrix.environment.name)] }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-${{ matrix.environment.name }}
          path: out/
          retention-days: 30

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    environment: staging

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-staging
          path: out/

      - name: Deploy to staging
        run: |
          # Deploy to staging server
          # Example with rsync
          rsync -avz --delete out/ user@staging-server:/var/www/frontend/

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-production
          path: out/

      - name: Deploy to S3
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Sync to S3
        run: |
          aws s3 sync out/ s3://${{ secrets.S3_BUCKET }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .next/cache/

before_script:
  - node --version
  - npm --version

test:
  stage: test
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
    - npm run lint
    - npm run type-check
    - npm test
  except:
    - tags

build:staging:
  stage: build
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
    - npm run build
  variables:
    NEXT_PUBLIC_API_URL: $STAGING_API_URL
    NEXT_PUBLIC_AUTHORITY_URL: $STAGING_AUTHORITY_URL
    NEXT_PUBLIC_CLIENT_ID: $STAGING_CLIENT_ID
  artifacts:
    paths:
      - out/
    expire_in: 1 hour
  only:
    - staging

build:production:
  stage: build
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
    - npm run build
  variables:
    NEXT_PUBLIC_API_URL: $PRODUCTION_API_URL
    NEXT_PUBLIC_AUTHORITY_URL: $PRODUCTION_AUTHORITY_URL
    NEXT_PUBLIC_CLIENT_ID: $PRODUCTION_CLIENT_ID
  artifacts:
    paths:
      - out/
    expire_in: 1 hour
  only:
    - main

deploy:staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache rsync openssh
  script:
    - rsync -avz --delete out/ $STAGING_USER@$STAGING_HOST:$STAGING_PATH
  dependencies:
    - build:staging
  only:
    - staging

deploy:production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache aws-cli
  script:
    - aws s3 sync out/ s3://$PRODUCTION_S3_BUCKET --delete
    - aws cloudfront create-invalidation --distribution-id $PRODUCTION_CLOUDFRONT_ID --paths "/*"
  dependencies:
    - build:production
  only:
    - main
  when: manual
```

## Performance Optimization

### Build Optimization

```javascript
// next.config.js - Production optimizations
const nextConfig = {
  // Enable static optimization
  output: 'export',
  trailingSlash: true,
  
  // Image optimization
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compression
  compress: true,
  
  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
      return config
    },
  }),
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
}
```

### CDN Configuration

```bash
# CloudFront behaviors for optimal caching
# Static assets (JS, CSS, images)
/static/* -> Cache for 1 year
/_next/static/* -> Cache for 1 year

# HTML files
/*.html -> Cache for 1 hour, revalidate

# API calls
/api/* -> No cache

# Default
/* -> Cache for 1 day, revalidate
```

## Monitoring and Observability

### Error Tracking

```typescript
// lib/monitoring/error-tracking.ts
import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_APP_ENV,
    tracesSampleRate: 0.1,
    beforeSend: (event) => {
      // Filter out certain errors
      if (event.exception) {
        const error = event.exception.values?.[0]
        if (error?.type === 'ChunkLoadError') {
          return null // Don't send chunk load errors
        }
      }
      return event
    },
  })
}

export { Sentry }
```

### Performance Monitoring

```typescript
// lib/monitoring/web-vitals.ts
import { NextWebVitalsMetric } from 'next/app'
import { Sentry } from './error-tracking'

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    gtag('event', metric.name, {
      custom_map: { metric_id: 'web_vitals' },
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    })

    // Send to Sentry
    Sentry.addBreadcrumb({
      category: 'web-vital',
      message: `${metric.name}: ${metric.value}`,
      level: 'info',
    })
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric)
  }
}
```

### Health Checks

```typescript
// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_VERSION,
  }

  try {
    res.status(200).json(healthcheck)
  } catch (error) {
    healthcheck.message = 'Error'
    res.status(503).json(healthcheck)
  }
}
```

## Security Considerations

### Content Security Policy

```javascript
// next.config.js - Security headers
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "img-src 'self' data: https:",
              "font-src 'self' https:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

### Environment Secrets Management

```bash
# Use secret management systems for sensitive data
# Never commit secrets to version control

# AWS Secrets Manager
aws secretsmanager get-secret-value --secret-id prod/frontend/env

# Kubernetes Secrets
kubectl create secret generic frontend-secrets \
  --from-literal=api-url=https://api.example.com \
  --from-literal=client-id=your-client-id

# HashiCorp Vault
vault kv get -format=json secret/frontend/prod
```

## Rollback Strategy

### Blue-Green Deployment

```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

CURRENT_ENV=$(aws s3api get-bucket-website --bucket $BUCKET_NAME --query 'RedirectAllRequestsTo.HostName' --output text)

if [ "$CURRENT_ENV" = "blue" ]; then
  NEW_ENV="green"
else
  NEW_ENV="blue"
fi

echo "Deploying to $NEW_ENV environment..."

# Deploy to inactive environment
aws s3 sync out/ s3://$BUCKET_NAME-$NEW_ENV --delete

# Update CloudFront to point to new environment
aws cloudfront update-distribution \
  --id $DISTRIBUTION_ID \
  --distribution-config file://cloudfront-config-$NEW_ENV.json

echo "Deployment complete. Monitoring for 5 minutes..."
sleep 300

# Health check
if curl -f $HEALTH_CHECK_URL; then
  echo "Health check passed. Deployment successful."
else
  echo "Health check failed. Rolling back..."
  # Rollback logic here
fi
```

### Database/API Compatibility

```typescript
// Ensure API compatibility during deployments
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1'

// Use feature flags for gradual rollouts
const features = {
  newDashboard: process.env.NEXT_PUBLIC_FEATURE_NEW_DASHBOARD === 'true',
  enhancedCharts: process.env.NEXT_PUBLIC_FEATURE_ENHANCED_CHARTS === 'true',
}
```

This comprehensive deployment guide covers all aspects of deploying and maintaining the Gamescoin Frontend application in production environments. 