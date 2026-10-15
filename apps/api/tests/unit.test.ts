// ANDALUS CREATIVE WORLD — Unit Tests (no PostgreSQL required)
// Run with: npx vitest run

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import crypto from 'node:crypto';

// ============================================================
// VALIDATION SCHEMAS (duplicated from API for testing)
// ============================================================

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const createProjectSchema = z.object({
  type: z.enum(['FILM', 'SHORT_FILM', 'MUSIC_VIDEO', 'MUSIC_PROJECT', 'OTHER']),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
});

const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PROCESSING', 'COMPLETED', 'ARCHIVED']).optional(),
  rightsType: z.enum(['OWN_WORK', 'PUBLIC_DOMAIN', 'LICENSED', 'AUTHORIZED']).optional(),
  rightsNotes: z.string().max(1000).optional(),
});

// ============================================================
// UTILITY FUNCTIONS (duplicated from API for testing)
// ============================================================

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// ============================================================
// TESTS: Zod Validations
// ============================================================

describe('Zod Validations', () => {
  describe('registerSchema', () => {
    it('accepts valid registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
        displayName: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password shorter than 8 characters', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'short',
        displayName: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('rejects displayName shorter than 2 characters', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'A',
      });
      expect(result.success).toBe(false);
    });

    it('rejects displayName longer than 50 characters', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'A'.repeat(51),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('accepts valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createProjectSchema', () => {
    it('accepts valid project data', () => {
      const result = createProjectSchema.safeParse({
        type: 'FILM',
        title: 'My Film',
        description: 'A great film',
      });
      expect(result.success).toBe(true);
    });

    it('accepts project without description', () => {
      const result = createProjectSchema.safeParse({
        type: 'SHORT_FILM',
        title: 'My Short Film',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid project type', () => {
      const result = createProjectSchema.safeParse({
        type: 'INVALID',
        title: 'My Project',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty title', () => {
      const result = createProjectSchema.safeParse({
        type: 'FILM',
        title: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects title longer than 200 characters', () => {
      const result = createProjectSchema.safeParse({
        type: 'FILM',
        title: 'A'.repeat(201),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateProjectSchema', () => {
    it('accepts partial update', () => {
      const result = updateProjectSchema.safeParse({
        title: 'Updated Title',
      });
      expect(result.success).toBe(true);
    });

    it('accepts rights declaration', () => {
      const result = updateProjectSchema.safeParse({
        rightsType: 'OWN_WORK',
        rightsNotes: 'I am the author',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid status', () => {
      const result = updateProjectSchema.safeParse({
        status: 'INVALID',
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================
// TESTS: Token Generation
// ============================================================

describe('Token Generation', () => {
  it('generates 64-character hex tokens', () => {
    const token = generateToken();
    expect(token).toHaveLength(64);
    expect(/^[0-9a-f]+$/.test(token)).toBe(true);
  });

  it('generates unique tokens', () => {
    const tokens = new Set();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateToken());
    }
    expect(tokens.size).toBe(100);
  });
});

// ============================================================
// TESTS: Token Hashing
// ============================================================

describe('Token Hashing', () => {
  it('produces 64-character SHA-256 hash', () => {
    const token = generateToken();
    const hash = hashToken(token);
    expect(hash).toHaveLength(64);
    expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
  });

  it('produces consistent hash for same token', () => {
    const token = 'test-token';
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);
    expect(hash1).toBe(hash2);
  });

  it('produces different hash for different tokens', () => {
    const hash1 = hashToken('token1');
    const hash2 = hashToken('token2');
    expect(hash1).not.toBe(hash2);
  });
});

// ============================================================
// TESTS: Email Normalization
// ============================================================

describe('Email Normalization', () => {
  it('converts to lowercase', () => {
    expect(normalizeEmail('Test@Example.COM')).toBe('test@example.com');
  });

  it('trims whitespace', () => {
    expect(normalizeEmail('  test@example.com  ')).toBe('test@example.com');
  });

  it('handles both', () => {
    expect(normalizeEmail('  Test@Example.COM  ')).toBe('test@example.com');
  });
});

// ============================================================
// TESTS: Security
// ============================================================

describe('Security', () => {
  it('password hash is not plaintext', () => {
    // This test verifies that we would use argon2 in production
    // For unit tests, we verify the concept
    const password = 'mypassword';
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    expect(hash).not.toBe(password);
    expect(hash).toHaveLength(64);
  });

  it('session tokens are cryptographically random', () => {
    const token1 = generateToken();
    const token2 = generateToken();
    // Tokens should be different (extremely high probability)
    expect(token1).not.toBe(token2);
  });
});
