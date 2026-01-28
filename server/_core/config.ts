/**
 * Centralized configuration management
 * All application configuration should be accessed through this module
 */

import { ENV } from './env';

export interface DatabaseConfig {
  url: string;
  poolSize: number;
  timeout: number;
}

export interface ServerConfig {
  port: number;
  host: string;
  nodeEnv: 'development' | 'production' | 'test';
  corsOrigins: string[];
}

export interface AuthConfig {
  ownerOpenId: string;
  sessionTimeout: number;
}

export interface UploadConfig {
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  s3Bucket?: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

/**
 * Get database configuration
 */
export function getDatabaseConfig(): DatabaseConfig {
  return {
    url: process.env.DATABASE_URL || '',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
    timeout: parseInt(process.env.DB_TIMEOUT || '30000', 10),
  };
}

/**
 * Get server configuration
 */
export function getServerConfig(): ServerConfig {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
    nodeEnv: (process.env.NODE_ENV || 'development') as ServerConfig['nodeEnv'],
    corsOrigins: (process.env.CORS_ORIGINS || '*').split(',').map(s => s.trim()),
  };
}

/**
 * Get authentication configuration
 */
export function getAuthConfig(): AuthConfig {
  return {
    ownerOpenId: ENV.ownerOpenId,
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '86400000', 10), // 24 hours default
  };
}

/**
 * Get upload configuration
 */
export function getUploadConfig(): UploadConfig {
  return {
    maxFileSize: parseInt(process.env.MAX_UPLOAD_SIZE || '52428800', 10), // 50MB default
    allowedTypes: (process.env.ALLOWED_UPLOAD_TYPES || 'image/*,application/pdf,video/*').split(',').map(s => s.trim()),
    s3Bucket: process.env.S3_BUCKET,
  };
}

/**
 * Get rate limiting configuration
 */
export function getRateLimitConfig(): RateLimitConfig {
  return {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10), // 1 minute default
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  };
}

/**
 * Check if feature flag is enabled
 */
export function isFeatureEnabled(featureName: string): boolean {
  const envVar = `FEATURE_${featureName.toUpperCase()}`;
  return process.env[envVar] === 'true' || process.env[envVar] === '1';
}
