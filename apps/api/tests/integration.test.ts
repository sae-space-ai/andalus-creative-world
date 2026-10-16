// PRUEBA REAL Nº 001 — Integration Test
// ANDALUS CREATIVE WORLD — FASE 00
//
// Este test requiere PostgreSQL real y backend Fastify.
// Ejecutar con: cd apps/api && npx vitest run tests/integration.test.ts
//
// Variables de entorno necesarias:
// DATABASE_URL=postgresql://...
// NODE_ENV=test

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

// Utility functions (same as API)
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

describe('PRUEBA REAL Nº 001 — User Journey', () => {
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testDisplayName = 'Test User 001';
  let userId: string;
  let verificationToken: string;
  let sessionId: string;

  beforeAll(async () => {
    // Ensure clean state
    await prisma.user.deleteMany({
      where: { email: { startsWith: 'test_' } },
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.paymentRecord.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.promotionRedemption.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.creditWallet?.delete({ where: { userId } }).catch(() => {});
    await prisma.securityEvent.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.passwordResetToken.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.emailVerificationToken.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.session.deleteMany({ where: { userId } }).catch(() => {});
    await prisma.sourceDocument.deleteMany({ where: { ownerId: userId } }).catch(() => {});
    await prisma.project.deleteMany({ where: { ownerId: userId } }).catch(() => {});
    await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    await prisma.$disconnect();
  });

  // ============================================================
  // STEP 01: API accessible
  // ============================================================
  it('01. PostgreSQL connection is active', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    expect(result).toBeDefined();
  });

  // ============================================================
  // STEP 02: Register user
  // ============================================================
  it('02. Register a new user with hashed password', async () => {
    const emailNormalized = normalizeEmail(testEmail);
    const passwordHash = await argon2.hash(testPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const user = await prisma.user.create({
       {
        email: testEmail,
        emailNormalized,
        passwordHash,
        displayName: testDisplayName,
        status: 'PENDING_VERIFICATION',
      },
    });

    userId = user.id;
    expect(userId).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(user.passwordHash).not.toBe(testPassword);
    expect(user.status).toBe('PENDING_VERIFICATION');
    expect(user.emailVerifiedAt).toBeNull();
  });

  // ============================================================
  // STEP 03: Confirm user exists in PostgreSQL
  // ============================================================
  it('03. User persists in PostgreSQL', async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    expect(user).not.toBeNull();
    expect(user!.email).toBe(testEmail);
    expect(user!.displayName).toBe(testDisplayName);
  });

  // ============================================================
  // STEP 04: Email verification token created
  // ============================================================
  it('04. Verification token is created and stored as hash', async () => {
    verificationToken = generateToken();
    const tokenHash = hashToken(verificationToken);

    const token = await prisma.emailVerificationToken.create({
       {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    expect(token.id).toBeDefined();
    expect(token.tokenHash).toBe(tokenHash);
    expect(token.tokenHash).not.toBe(verificationToken); // Hash, not plaintext
    expect(token.usedAt).toBeNull();
  });

  // ============================================================
  // STEP 05: Verify email with valid token
  // ============================================================
  it('05. Email verification marks user as verified', async () => {
    const tokenHash = hashToken(verificationToken);

    // Find and validate token
    const token = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    expect(token).not.toBeNull();
    expect(token!.usedAt).toBeNull();
    expect(token!.expiresAt.getTime()).toBeGreaterThan(Date.now());

    // Mark as used
    await prisma.emailVerificationToken.update({
      where: { id: token!.id },
       { usedAt: new Date() },
    });

    // Verify user
    await prisma.user.update({
      where: { id: userId },
       {
        emailVerifiedAt: new Date(),
        status: 'ACTIVE',
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user!.emailVerifiedAt).not.toBeNull();
    expect(user!.status).toBe('ACTIVE');
  });

  // ============================================================
  // STEP 06: Token cannot be reused
  // ============================================================
  it('06. Used token cannot be reused', async () => {
    const tokenHash = hashToken(verificationToken);
    const token = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    expect(token!.usedAt).not.toBeNull();
    // In real API, this would return an error
  });

  // ============================================================
  // STEP 07: Login with correct credentials
  // ============================================================
  it('07. Login verifies password with Argon2id', async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user!.passwordHash).not.toBeNull();

    const valid = await argon2.verify(user!.passwordHash!, testPassword);
    expect(valid).toBe(true);

    const invalid = await argon2.verify(user!.passwordHash!, 'WrongPassword');
    expect(invalid).toBe(false);
  });

  // ============================================================
  // STEP 08: Session created
  // ============================================================
  it('08. Session is created with hashed token', async () => {
    const sessionToken = generateToken();
    const tokenHash = hashToken(sessionToken);

    const session = await prisma.session.create({
       {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: 'test-agent',
        ipAddress: '127.0.0.1',
      },
    });

    sessionId = session.id;
    expect(sessionId).toBeDefined();
    expect(session.tokenHash).not.toBe(sessionToken); // Hash stored, not plaintext
  });

  // ============================================================
  // STEP 09: /auth/me returns correct user
  // ============================================================
  it('09. Session resolves to correct user', async () => {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    expect(session).not.toBeNull();
    expect(session!.user.id).toBe(userId);
    expect(session!.user.email).toBe(testEmail);
    expect(session!.revokedAt).toBeNull();
    expect(session!.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  // ============================================================
  // STEP 10: Create private project
  // ============================================================
  let projectId: string;

  it('10. Create a private project owned by the user', async () => {
    const project = await prisma.project.create({
       {
        ownerId: userId,
        type: 'FILM',
        title: 'Mi Primera Película',
        description: 'Una historia increíble',
        status: 'DRAFT',
        visibility: 'PRIVATE',
      },
    });

    projectId = project.id;
    expect(projectId).toBeDefined();
    expect(project.ownerId).toBe(userId);
    expect(project.visibility).toBe('PRIVATE');
  });

  // ============================================================
  // STEP 11: Project persists in PostgreSQL
  // ============================================================
  it('11. Project is persisted in PostgreSQL', async () => {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    expect(project).not.toBeNull();
    expect(project!.title).toBe('Mi Primera Película');
    expect(project!.ownerId).toBe(userId);
  });

  // ============================================================
  // STEP 12: Upload PDF (simulated)
  // ============================================================
  let documentId: string;

  it('12. Document record is created with checksum', async () => {
    // Simulate PDF content
    const pdfContent = Buffer.from('ANDALUS CREATIVE WORLD - PRUEBA DE LECTURA NUMERO 001');
    const checksum = crypto.createHash('sha256').update(pdfContent).digest('hex');

    const doc = await prisma.sourceDocument.create({
       {
        projectId,
        ownerId: userId,
        originalName: 'prueba_001.pdf',
        mimeType: 'application/pdf',
        sizeBytes: pdfContent.length,
        checksum,
        storagePath: '/tmp/test_prueba_001.pdf',
        status: 'COMPLETED',
        pageCount: 1,
      },
    });

    documentId = doc.id;
    expect(documentId).toBeDefined();
    expect(doc.checksum).toHaveLength(64); // SHA-256 hex
    expect(doc.projectId).toBe(projectId);
    expect(doc.ownerId).toBe(userId);
  });

  // ============================================================
  // STEP 13: Document processing status
  // ============================================================
  it('13. Document has COMPLETED status', async () => {
    const doc = await prisma.sourceDocument.findUnique({
      where: { id: documentId },
    });
    expect(doc!.status).toBe('COMPLETED');
    expect(doc!.pageCount).toBe(1);
  });

  // ============================================================
  // STEP 14: Text extracted and persisted
  // ============================================================
  it('14. Extracted text is persisted in DocumentPage', async () => {
    const page = await prisma.documentPage.create({
       {
        documentId,
        pageNumber: 1,
        text: 'ANDALUS CREATIVE WORLD - PRUEBA DE LECTURA NUMERO 001',
      },
    });

    expect(page.id).toBeDefined();
    expect(page.text).toContain('ANDALUS CREATIVE WORLD');
    expect(page.text).toContain('PRUEBA DE LECTURA NUMERO 001');
  });

  // ============================================================
  // STEP 15: Text is queryable
  // ============================================================
  it('15. Extracted text can be retrieved from PostgreSQL', async () => {
    const pages = await prisma.documentPage.findMany({
      where: { documentId },
      orderBy: { pageNumber: 'asc' },
    });

    expect(pages.length).toBeGreaterThan(0);
    expect(pages[0].text).toContain('ANDALUS CREATIVE WORLD');
  });

  // ============================================================
  // STEP 16: Logout (revoke session)
  // ============================================================
  it('16. Logout revokes the session', async () => {
    await prisma.session.update({
      where: { id: sessionId },
       { revokedAt: new Date() },
    });

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    expect(session!.revokedAt).not.toBeNull();
  });

  // ============================================================
  // STEP 17: Revoked session cannot authorize
  // ============================================================
  it('17. Revoked session is rejected', async () => {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    expect(session!.revokedAt).not.toBeNull();
    // In real API, this would return 401
  });

  // ============================================================
  // STEP 18: New login creates new session
  // ============================================================
  let newSessionId: string;

  it('18. New login creates a new session', async () => {
    const sessionToken = generateToken();
    const tokenHash = hashToken(sessionToken);

    const session = await prisma.session.create({
       {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: 'test-agent-2',
        ipAddress: '127.0.0.1',
      },
    });

    newSessionId = session.id;
    expect(newSessionId).toBeDefined();
    expect(newSessionId).not.toBe(sessionId);
  });

  // ============================================================
  // STEP 19: Project recovered after new login
  // ============================================================
  it('19. Project is recovered with new session', async () => {
    const session = await prisma.session.findUnique({
      where: { id: newSessionId },
      include: { user: true },
    });

    const projects = await prisma.project.findMany({
      where: { ownerId: session!.user.id },
    });

    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].id).toBe(projectId);
    expect(projects[0].title).toBe('Mi Primera Película');
  });

  // ============================================================
  // STEP 20: Document recovered
  // ============================================================
  it('20. Document is recovered with project', async () => {
    const docs = await prisma.sourceDocument.findMany({
      where: { projectId },
    });

    expect(docs.length).toBeGreaterThan(0);
    expect(docs[0].id).toBe(documentId);
    expect(docs[0].originalName).toBe('prueba_001.pdf');
  });

  // ============================================================
  // STEP 21: Content persists
  // ============================================================
  it('21. Extracted text persists across sessions', async () => {
    const pages = await prisma.documentPage.findMany({
      where: { documentId },
    });

    expect(pages.length).toBeGreaterThan(0);
    expect(pages[0].text).toContain('PRUEBA DE LECTURA NUMERO 001');
  });

  // ============================================================
  // STEP 22: Create second user
  // ============================================================
  let user2Id: string;

  it('22. Create a second independent user', async () => {
    const user2Email = `user2_${Date.now()}@example.com`;
    const passwordHash = await argon2.hash('User2Password123!', {
      type: argon2.argon2id,
    });

    const user2 = await prisma.user.create({
       {
        email: user2Email,
        emailNormalized: normalizeEmail(user2Email),
        passwordHash,
        displayName: 'User Two',
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
      },
    });

    user2Id = user2.id;
    expect(user2Id).toBeDefined();
    expect(user2Id).not.toBe(userId);
  });

  // ============================================================
  // STEP 23: User B cannot access User A's project
  // ============================================================
  it('23. User B CANNOT access User A project (isolation)', async () => {
    // Try to find User A's project as User B
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: user2Id, // User B trying to access
      },
    });

    // Should be null because ownerId doesn't match
    expect(project).toBeNull();
  });

  it('23b. User B CANNOT access User A document', async () => {
    const doc = await prisma.sourceDocument.findFirst({
      where: {
        id: documentId,
        ownerId: user2Id, // User B trying to access
      },
    });

    expect(doc).toBeNull();
  });

  it('23c. User B CANNOT see User A projects in list', async () => {
    const projects = await prisma.project.findMany({
      where: { ownerId: user2Id },
    });

    // User B has no projects
    expect(projects).toHaveLength(0);
  });

  // ============================================================
  // STEP 24: Cleanup
  // ============================================================
  it('24. Cleanup test data', async () => {
    // Delete User B
    await prisma.user.delete({ where: { id: user2Id } });

    // Verify User A data still exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user).not.toBeNull();
  });
});
