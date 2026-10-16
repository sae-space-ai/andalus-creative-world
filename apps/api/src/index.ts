// ANDALUS CREATIVE WORLD — API Server
// Fastify + TypeScript + Prisma + PostgreSQL
// FASE 00

import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import formbody from '@fastify/formbody';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { PrismaClient, User, Session } from '@prisma/client';
import argon2 from 'argon2';
import { z } from 'zod';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import pdfParse from 'pdf-parse';

// ============================================================
// TYPE DECLARATIONS
// ============================================================

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    session?: Session;
  }
}

// ============================================================
// CONFIGURATION
// ============================================================

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'dev-secret-change-in-production-min-32-chars!!';
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const SESSION_DURATION_DAYS = 7;

// ============================================================
// PRISMA CLIENT
// ============================================================

const prisma = new PrismaClient();

// ============================================================
// FASTIFY SERVER
// ============================================================

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register plugins
await app.register(cors, {
  origin: FRONTEND_URL,
  credentials: true,
});

await app.register(cookie, {
  secret: COOKIE_SECRET,
});

await app.register(formbody);

await app.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// ============================================================
// UTILITIES
// ============================================================

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// ============================================================
// AUTH MIDDLEWARE
// ============================================================

async function authenticate(request: any, reply: any) {
  const sessionToken = request.cookies['session_token'];
  if (!sessionToken) {
    return reply.status(401).send({ error: 'Not authenticated' });
  }

  const tokenHash = hashToken(sessionToken);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return reply.status(401).send({ error: 'Invalid or expired session' });
  }

  // Update last activity
  await prisma.session.update({
    where: { id: session.id },
    data: { lastActivity: new Date() },
  });

  request.user = session.user;
  request.session = session;
}

// ============================================================
// HEALTH & CAPABILITIES
// ============================================================

app.get('/api/v1/health', async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'error', database: 'disconnected', timestamp: new Date().toISOString() };
  }
});

app.get('/api/v1/capabilities', async () => {
  return {
    version: '0.1.0',
    modules: {
      cinema: { id: 'cinema', name: 'Andalus Cinema', status: 'DESIGNED', phase: 'FASE 00' },
      'cinema-plus': { id: 'cinema-plus', name: 'Andalus Cinema+', status: 'DESIGNED', phase: 'FASE 01+' },
      community: { id: 'community', name: 'Andalus Community', status: 'DESIGNED', phase: 'FASE 01+' },
      festivals: { id: 'festivals', name: 'Andalus Festivals', status: 'DESIGNED', phase: 'FASE 01+' },
      rights: { id: 'rights', name: 'Andalus Rights', status: 'DESIGNED', phase: 'FASE 01+' },
      trace: { id: 'trace', name: 'Andalus Trace 360°', status: 'DESIGNED', phase: 'FASE 02+' },
      wallet: { id: 'wallet', name: 'Andalus Wallet', status: 'DESIGNED', phase: 'FASE 02+' },
    },
    integrations: {
      google: process.env.GOOGLE_CLIENT_ID ? 'CONFIGURED' : 'CONFIGURATION_REQUIRED',
      stripe: process.env.STRIPE_SECRET_KEY ? 'CONFIGURED' : 'CONFIGURATION_REQUIRED',
      email: process.env.SMTP_HOST ? 'CONFIGURED' : 'CONFIGURATION_REQUIRED',
      pdfProcessing: 'IMPLEMENTED',
    },
  };
});

// ============================================================
// AUTH ROUTES
// ============================================================

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(50),
});

app.post('/api/v1/auth/register', async (request, reply) => {
  const body = registerSchema.parse(request.body);
  const emailNormalized = normalizeEmail(body.email);

  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { emailNormalized },
  });

  if (existing) {
    // Anti-enumeration: don't reveal if email exists
    return reply.status(200).send({ 
      message: 'Si el correo es válido, recibirás un email de verificación.' 
    });
  }

  // Create user
  const passwordHash = await hashPassword(body.password);
  const user = await prisma.user.create({
    data: {
      email: body.email,
      emailNormalized,
      passwordHash,
      displayName: body.displayName,
      status: 'PENDING_VERIFICATION',
    },
  });

  // Create email verification token
  const token = generateToken();
  const tokenHash = hashToken(token);
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  // TODO: Send email with verification link
  // For now, log the token (in production, this would be sent via SMTP)
  console.log(`[DEV] Verification token for ${emailNormalized}: ${token}`);

  // Log security event
  await prisma.securityEvent.create({
    data: {
      userId: user.id,
      type: 'REGISTER',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    },
  });

  return reply.status(201).send({
    message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.',
    userId: user.id,
  });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

app.post('/api/v1/auth/login', async (request, reply) => {
  const body = loginSchema.parse(request.body);
  const emailNormalized = normalizeEmail(body.email);

  // Find user
  const user = await prisma.user.findUnique({
    where: { emailNormalized },
  });

  if (!user || !user.passwordHash) {
    // Anti-enumeration
    await new Promise(r => setTimeout(r, 500)); // Prevent timing attacks
    return reply.status(401).send({ error: 'Credenciales incorrectas' });
  }

  // Verify password
  const valid = await verifyPassword(user.passwordHash, body.password);
  if (!valid) {
    await prisma.securityEvent.create({
      data: {
        userId: user.id,
        type: 'FAILED_LOGIN',
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      },
    });
    return reply.status(401).send({ error: 'Credenciales incorrectas' });
  }

  // Check if email is verified
  if (!user.emailVerifiedAt) {
    return reply.status(403).send({ error: 'Debes verificar tu correo electrónico' });
  }

  // Create session
  const sessionToken = generateToken();
  const tokenHash = hashToken(sessionToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip,
    },
  });

  // Set cookie
  reply.setCookie('session_token', sessionToken, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  });

  // Log security event
  await prisma.securityEvent.create({
    data: {
      userId: user.id,
      type: 'LOGIN',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status,
    },
  };
});

app.post('/api/v1/auth/logout', async (request, reply) => {
  await authenticate(request, reply);
  if (reply.sent) return;

  const sessionToken = request.cookies['session_token'];
  const tokenHash = hashToken(sessionToken);

  // Revoke session
  await prisma.session.updateMany({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  });

  // Clear cookie
  reply.clearCookie('session_token', { path: '/' });

  // Log security event
  await prisma.securityEvent.create({
    data: {
      userId: request.user.id,
      type: 'LOGOUT',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    },
  });

  return { message: 'Sesión cerrada' };
});

app.get('/api/v1/auth/me', async (request, reply) => {
  await authenticate(request, reply);
  if (reply.sent) return;

  return {
    user: {
      id: request.user.id,
      email: request.user.email,
      displayName: request.user.displayName,
      role: request.user.role,
      status: request.user.status,
      emailVerifiedAt: request.user.emailVerifiedAt,
      createdAt: request.user.createdAt,
    },
  };
});

app.post('/api/v1/auth/verify-email', async (request, reply) => {
  const { token } = z.object({ token: z.string() }).parse(request.body);
  const tokenHash = hashToken(token);

  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!verificationToken || verificationToken.usedAt || verificationToken.expiresAt < new Date()) {
    return reply.status(400).send({ error: 'Token inválido o expirado' });
  }

  // Mark token as used
  await prisma.emailVerificationToken.update({
    where: { id: verificationToken.id },
    data: { usedAt: new Date() },
  });

  // Verify user email
  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: {
      emailVerifiedAt: new Date(),
      status: 'ACTIVE',
    },
  });

  return { message: 'Correo verificado correctamente' };
});

app.post('/api/v1/auth/forgot-password', async (request, reply) => {
  const { email } = z.object({ email: z.string().email() }).parse(request.body);
  const emailNormalized = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { emailNormalized },
  });

  if (user) {
    // Create reset token
    const token = generateToken();
    const tokenHash = hashToken(token);
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // TODO: Send email with reset link
    console.log(`[DEV] Password reset token for ${emailNormalized}: ${token}`);
  }

  // Anti-enumeration: always return success
  return { message: 'Si el correo existe, recibirás un enlace de recuperación' };
});

app.post('/api/v1/auth/reset-password', async (request, reply) => {
  const { token, password } = z.object({
    token: z.string(),
    password: z.string().min(8),
  }).parse(request.body);

  const tokenHash = hashToken(token);
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return reply.status(400).send({ error: 'Token inválido o expirado' });
  }

  // Update password
  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash },
  });

  // Mark token as used
  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  });

  // Revoke all sessions
  await prisma.session.updateMany({
    where: { userId: resetToken.userId },
    data: { revokedAt: new Date() },
  });

  return { message: 'Contraseña restablecida correctamente' };
});

// ============================================================
// PROJECTS ROUTES
// ============================================================

app.get('/api/v1/projects', async (request, reply) => {
  await authenticate(request, reply);
  if (reply.sent) return;

  const projects = await prisma.project.findMany({
    where: { ownerId: request.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { documents: true },
      },
    },
  });

  return { projects };
});

const createProjectSchema = z.object({
  type: z.enum(['FILM', 'SHORT_FILM', 'MUSIC_VIDEO', 'MUSIC_PROJECT', 'OTHER']),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
});

app.post('/api/v1/projects', async (request, reply) => {
  await authenticate(request, reply);
  if (reply.sent) return;

  const body = createProjectSchema.parse(request.body);

  const project = await prisma.project.create({
    data: {
      ownerId: request.user.id,
      type: body.type,
      title: body.title,
      description: body.description || '',
    },
  });

  return reply.status(201).send({ project });
});

app.get('/api/v1/projects/:id', async (request, reply) => {
  await authenticate(request, reply);
  if (reply.sent) return;

  const { id } = request.params;

  const project = await prisma.project.findFirst({
    where: { id, ownerId: request.user.id },
    include: {
      documents: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!project) {
    return reply.status(404).send({ error: 'Proyecto no encontrado' });
  }

  return { project };
});

const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PROCESSING', 'COMPLETED', 'ARCHIVED']).optional(),
  rightsType: z.enum(['OWN_WORK', 'PUBLIC_DOMAIN', 'LICENSED', 'AUTHORIZED']).optional(),
  rightsNotes: z.string().max(1000).optional(),
});

app.patch('/api/v1/projects/:id', async (request, reply) => {
  await authenticate(request, reply);
  if (reply.sent) return;

  const { id } = request.params;
  const body = updateProjectSchema.parse(request.body);

  // Verify ownership
  const existing = await prisma.project.findFirst({
    where: { id, ownerId: request.user.id },
  });

  if (!existing) {
    return reply.status(404).send({ error: 'Proyecto no encontrado' });
  }

  const updateData: any = { ...body };
  if (body.rightsType) {
    updateData.rightsDeclaredAt = new Date();
  }

  const project = await prisma.project.update({
    where: { id },
    data: updateData,
  });

  return { project };
});

app.delete('/api/v1/projects/:id', async (request, reply) => {
  await authenticate(request, reply);
  if (reply.sent) return;

  const { id } = request.params;

  // Verify ownership
  const existing = await prisma.project.findFirst({
    where: { id, ownerId: request.user.id },
  });

  if (!existing) {
    return reply.status(404).send({ error: 'Proyecto no encontrado' });
  }

  await prisma.project.delete({ where: { id } });

  return { message: 'Proyecto eliminado' };
});

// ============================================================
// DOCUMENTS ROUTES
// ============================================================

app.get('/api/v1/projects/:id/documents', async (request, reply) => {
  await authenticate(request, reply);
  if (reply.sent) return;

  const { id } = request.params;

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id, ownerId: request.user.id },
  });

  if (!project) {
    return reply.status(404).send({ error: 'Proyecto no encontrado' });
  }

  const documents = await prisma.sourceDocument.findMany({
    where: { projectId: id },
    orderBy: { createdAt: 'desc' },
    include: {
      pages: {
        orderBy: { pageNumber: 'asc' },
      },
    },
  });

  return { documents };
});

app.post('/api/v1/projects/:id/documents', async (request, reply) => {
  await authenticate(request, reply);
  if (reply.sent) return;

  const { id: projectId } = request.params;

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: request.user.id },
  });

  if (!project) {
    return reply.status(404).send({ error: 'Proyecto no encontrado' });
  }

  // Check if project has rights declaration
  if (!project.rightsType) {
    return reply.status(400).send({ error: 'Debes declarar los derechos sobre la obra antes de subir documentos' });
  }

  // Get uploaded file
  const file = await request.file();
  if (!file) {
    return reply.status(400).send({ error: 'No se proporcionó ningún archivo' });
  }

  // Validate file type
  if (file.mimetype !== 'application/pdf') {
    return reply.status(400).send({ error: 'Solo se admiten archivos PDF' });
  }

  // Read file buffer
  const buffer = await file.toBuffer();

  // Validate size
  if (buffer.length > 50 * 1024 * 1024) {
    return reply.status(400).send({ error: 'El archivo supera el límite de 50 MB' });
  }

  // Calculate checksum
  const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

  // Save file to private storage
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}.pdf`;
  const filepath = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(filepath, buffer);

  // Create document record
  const document = await prisma.sourceDocument.create({
    data: {
      projectId,
      ownerId: request.user.id,
      originalName: file.filename,
      mimeType: file.mimetype,
      sizeBytes: buffer.length,
      checksum,
      storagePath: filepath,
      status: 'PROCESSING',
    },
  });

  // Create processing job
  const job = await prisma.documentProcessingJob.create({
    data: {
      documentId: document.id,
      status: 'PENDING',
    },
  });

  // Process PDF asynchronously (in production, this would be a background job)
  processDocument(document.id, filepath).catch(err => {
    console.error('Error processing document:', err);
  });

  return reply.status(201).send({ document });
});

// PDF processing function
async function processDocument(documentId: string, filepath: string) {
  const job = await prisma.documentProcessingJob.findFirst({
    where: { documentId, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });

  if (!job) return;

  await prisma.documentProcessingJob.update({
    where: { id: job.id },
    data: {
      status: 'PROCESSING',
      startedAt: new Date(),
      attempts: { increment: 1 },
    },
  });

  try {
    // Read PDF file
    const pdfBuffer = await fs.readFile(filepath);

    // Parse PDF
    const pdfData = await pdfParse(pdfBuffer);

    // Check if text was extracted
    if (!pdfData.text || pdfData.text.trim().length < 10) {
      // PDF is scanned or has no extractable text
      await prisma.sourceDocument.update({
        where: { id: documentId },
        data: {
          status: 'NEEDS_OCR',
          pageCount: pdfData.numpages,
          errorMessage: 'El documento no contiene texto extraíble. Requiere OCR.',
        },
      });
    } else {
      // Split text into pages (approximate)
      const pages = splitTextIntoPages(pdfData.text, pdfData.numpages);

      // Save pages
      for (let i = 0; i < pages.length; i++) {
        await prisma.documentPage.create({
          data: {
            documentId,
            pageNumber: i + 1,
            text: pages[i],
          },
        });
      }

      // Update document
      await prisma.sourceDocument.update({
        where: { id: documentId },
        data: {
          status: 'COMPLETED',
          pageCount: pdfData.numpages,
        },
      });
    }

    // Update job
    await prisma.documentProcessingJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date(),
      },
    });
  } catch (error: any) {
    console.error('PDF processing error:', error);

    await prisma.sourceDocument.update({
      where: { id: documentId },
      data: {
        status: 'FAILED',
        errorMessage: error.message || 'Error al procesar el documento',
      },
    });

    await prisma.documentProcessingJob.update({
      where: { id: job.id },
      data: {
        status: 'FAILED',
        error: error.message,
      },
    });
  }
}

// Split text into pages (simple heuristic)
function splitTextIntoPages(text: string, numPages: number): string[] {
  if (numPages <= 1) return [text];
  
  const charsPerPage = Math.ceil(text.length / numPages);
  const pages: string[] = [];
  
  for (let i = 0; i < numPages; i++) {
    const start = i * charsPerPage;
    const end = Math.min(start + charsPerPage, text.length);
    pages.push(text.slice(start, end));
  }
  
  return pages;
}

// ============================================================
// START SERVER
// ============================================================

try {
  await app.listen({ port: PORT, host: HOST });
  console.log(`🚀 Andalus Creative World API running on http://${HOST}:${PORT}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/api/v1/health`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
});
