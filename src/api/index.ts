import type { Project, ProjectType, SourceDocument, CapabilitiesResponse } from '../types';

// ANDALUS CREATIVE WORLD — Simulated API Layer
// NOTE: In production, this connects to Fastify + PostgreSQL
// This simulation uses localStorage for FASE 00 frontend development

const PROJECTS_KEY = 'andalus_projects';
const DOCUMENTS_KEY = 'andalus_documents';

function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function getDocuments(): SourceDocument[] {
  try {
    const raw = localStorage.getItem(DOCUMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveDocuments(docs: SourceDocument[]) {
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs));
}

// Projects API
export const projectsApi = {
  async list(userId: string): Promise<Project[]> {
    await new Promise(r => setTimeout(r, 400));
    return getProjects().filter(p => p.ownerId === userId);
  },

  async get(id: string, userId: string): Promise<Project | null> {
    await new Promise(r => setTimeout(r, 300));
    const project = getProjects().find(p => p.id === id);
    if (!project || project.ownerId !== userId) return null;
    return project;
  },

  async create(data: { type: ProjectType; title: string; description: string }, userId: string): Promise<Project> {
    await new Promise(r => setTimeout(r, 600));
    const project: Project = {
      id: crypto.randomUUID ? crypto.randomUUID() : `proj_${Date.now()}`,
      ownerId: userId,
      type: data.type,
      title: data.title,
      description: data.description,
      status: 'DRAFT',
      visibility: 'PRIVATE',
      rightsDeclaration: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [],
    };
    const projects = getProjects();
    projects.push(project);
    saveProjects(projects);
    return project;
  },

  async update(id: string, data: Partial<Pick<Project, 'title' | 'description' | 'status'>>, userId: string): Promise<Project | null> {
    await new Promise(r => setTimeout(r, 400));
    const projects = getProjects();
    const idx = projects.findIndex(p => p.id === id && p.ownerId === userId);
    if (idx === -1) return null;
    projects[idx] = { ...projects[idx], ...data, updatedAt: new Date().toISOString() };
    saveProjects(projects);
    return projects[idx];
  },

  async delete(id: string, userId: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 400));
    const projects = getProjects();
    const filtered = projects.filter(p => !(p.id === id && p.ownerId === userId));
    if (filtered.length === projects.length) return false;
    saveProjects(filtered);
    // Also remove associated documents
    const docs = getDocuments().filter(d => d.projectId !== id);
    saveDocuments(docs);
    return true;
  },
};

// Documents API
export const documentsApi = {
  async upload(projectId: string, file: File, userId: string): Promise<SourceDocument> {
    await new Promise(r => setTimeout(r, 1500));
    
    // Validate
    if (file.type !== 'application/pdf') {
      throw new Error('Solo se admiten archivos PDF.');
    }
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('El archivo supera el límite de 50 MB.');
    }
    
    // Verify project ownership
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId && p.ownerId === userId);
    if (!project) throw new Error('Proyecto no encontrado o sin permisos.');
    
    // Simulate checksum
    const checksum = `sha256_${Date.now()}_${file.size}`;
    
    const doc: SourceDocument = {
      id: crypto.randomUUID ? crypto.randomUUID() : `doc_${Date.now()}`,
      projectId,
      ownerId: userId,
      originalName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      checksum,
      status: 'PROCESSING',
      pageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const docs = getDocuments();
    docs.push(doc);
    saveDocuments(docs);
    
    // Simulate processing completion
    setTimeout(() => {
      const currentDocs = getDocuments();
      const idx = currentDocs.findIndex(d => d.id === doc.id);
      if (idx >= 0) {
        currentDocs[idx].status = 'COMPLETED';
        currentDocs[idx].pageCount = Math.max(1, Math.floor(file.size / 5000));
        currentDocs[idx].updatedAt = new Date().toISOString();
        saveDocuments(currentDocs);
      }
    }, 3000);
    
    return doc;
  },

  async list(projectId: string, userId: string): Promise<SourceDocument[]> {
    await new Promise(r => setTimeout(r, 300));
    const project = getProjects().find(p => p.id === projectId && p.ownerId === userId);
    if (!project) return [];
    return getDocuments().filter(d => d.projectId === projectId);
  },

  async get(id: string, userId: string): Promise<SourceDocument | null> {
    await new Promise(r => setTimeout(r, 200));
    const doc = getDocuments().find(d => d.id === id);
    if (!doc || doc.ownerId !== userId) return null;
    return doc;
  },
};

// Capabilities API
export const capabilitiesApi = {
  async get(): Promise<CapabilitiesResponse> {
    await new Promise(r => setTimeout(r, 200));
    return {
      version: '0.1.0',
      modules: {
        cinema: {
          id: 'cinema',
          name: 'Andalus Cinema',
          description: 'Producción audiovisual y adaptación de libros',
          status: 'DESIGNED',
          phase: 'FASE 00',
          features: ['Ingesta de libro', 'Análisis de estructura', 'Adaptación de guion', 'Biblia Cinematográfica', 'Storyboard', 'Generación visual'],
        },
        'cinema-plus': {
          id: 'cinema-plus',
          name: 'Andalus Cinema+',
          description: 'Estrenos, exhibición y distribución',
          status: 'DESIGNED',
          phase: 'FASE 01+',
          features: ['Catálogo', 'Reproductor', 'Distribución', 'Estadísticas'],
        },
        community: {
          id: 'community',
          name: 'Andalus Community',
          description: 'Comunidad de creadores y colaboración',
          status: 'DESIGNED',
          phase: 'FASE 01+',
          features: ['Perfiles artísticos', 'Portfolios', 'Colaboraciones', 'Mensajería'],
        },
        festivals: {
          id: 'festivals',
          name: 'Andalus Festivals',
          description: 'Concursos y festivales artísticos',
          status: 'DESIGNED',
          phase: 'FASE 01+',
          features: ['Organizadores', 'Inscripciones', 'Jurados', 'Votación'],
        },
        rights: {
          id: 'rights',
          name: 'Andalus Rights',
          description: 'Titularidad, autorizaciones y licencias',
          status: 'DESIGNED',
          phase: 'FASE 01+',
          features: ['Registro de obras', 'Licencias', 'Contratos', 'Auditoría'],
        },
        trace: {
          id: 'trace',
          name: 'Andalus Trace 360°',
          description: 'Identificación, seguimiento y rendimiento verificable',
          status: 'DESIGNED',
          phase: 'FASE 02+',
          features: ['Fingerprinting', 'Coincidencias', 'Informes', 'Liquidaciones'],
        },
        wallet: {
          id: 'wallet',
          name: 'Andalus Wallet',
          description: 'Ganancias de creadores y operaciones financieras',
          status: 'DESIGNED',
          phase: 'FASE 02+',
          features: ['Ganancias', 'Liquidaciones', 'Retiradas', 'Historial'],
        },
      },
      integrations: {
        google: 'CONFIGURATION_REQUIRED',
        stripe: 'CONFIGURATION_REQUIRED',
        email: 'IMPLEMENTED',
        pdfProcessing: 'IMPLEMENTED',
      },
    };
  },
};
