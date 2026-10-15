// ANDALUS CREATIVE WORLD — Type Contracts
// FASE 00 — Core types for the platform

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'DEACTIVATED';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  locale: string;
  notifications: boolean;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  lastActivity: string;
}

export type ProjectType = 'FILM' | 'SHORT_FILM' | 'MUSIC_VIDEO' | 'MUSIC_PROJECT' | 'OTHER';
export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'PROCESSING' | 'COMPLETED' | 'ARCHIVED';
export type ProjectVisibility = 'PRIVATE' | 'UNLISTED' | 'PUBLIC';

export interface Project {
  id: string;
  ownerId: string;
  type: ProjectType;
  title: string;
  description: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  rightsDeclaration: RightsDeclaration | null;
  createdAt: string;
  updatedAt: string;
  documents: SourceDocument[];
}

export type RightsType = 'OWN_WORK' | 'PUBLIC_DOMAIN' | 'LICENSED' | 'AUTHORIZED';

export interface RightsDeclaration {
  type: RightsType;
  declaredAt: string;
  notes: string;
}

export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'NEEDS_OCR';

export interface SourceDocument {
  id: string;
  projectId: string;
  ownerId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  status: DocumentStatus;
  pageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentPage {
  id: string;
  documentId: string;
  pageNumber: number;
  text: string;
  metadata: Record<string, unknown>;
}

export type CreditTransactionType = 
  | 'PURCHASE'
  | 'PROMOTIONAL_GRANT'
  | 'RESERVE'
  | 'CAPTURE'
  | 'RELEASE'
  | 'REFUND'
  | 'EXPIRE'
  | 'ADJUSTMENT';

export interface CreditWallet {
  userId: string;
  balance: number;
  promotionalBalance: number;
  updatedAt: string;
}

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  balanceAfter: number;
  reference: string;
  idempotencyKey: string;
  createdAt: string;
}

export type CapabilityStatus = 
  | 'DESIGNED'
  | 'NOT_STARTED'
  | 'IMPLEMENTED'
  | 'CONFIGURATION_REQUIRED'
  | 'BLOCKED'
  | 'TESTED'
  | 'VERIFIED'
  | 'DISABLED';

export interface ModuleCapability {
  id: string;
  name: string;
  description: string;
  status: CapabilityStatus;
  phase: string;
  features: string[];
}

export interface CapabilitiesResponse {
  version: string;
  modules: Record<string, ModuleCapability>;
  integrations: {
    google: CapabilityStatus;
    stripe: CapabilityStatus;
    email: CapabilityStatus;
    pdfProcessing: CapabilityStatus;
  };
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export type CinemaProductionStatus = 
  | 'INGESTED'
  | 'ANALYZING'
  | 'SCRIPT_DRAFT'
  | 'SCRIPT_REVIEW'
  | 'BIBLE_REVIEW'
  | 'STORYBOARD'
  | 'SCENE_PLANNING'
  | 'ASSET_GENERATION'
  | 'AUDIO_PRODUCTION'
  | 'VIDEO_PRODUCTION'
  | 'EDITING'
  | 'QUALITY_REVIEW'
  | 'RENDERING'
  | 'COMPLETED'
  | 'FAILED'
  | 'BLOCKED';

export interface TraceEvidence {
  type: 'DETECTED' | 'REPORTED' | 'VERIFIED' | 'ESTIMATED' | 'SETTLED';
  source: string;
  description: string;
  confidence: number;
  timestamp: string;
}
