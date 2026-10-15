// ANDALUS CREATIVE WORLD — API Client (Real Backend)
// Conecta con Fastify API en /api/v1

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface ApiError {
  error: string;
  message?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Send cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================================
// AUTH API
// ============================================================

export const authApi = {
  async register(email: string, password: string, displayName: string) {
    return fetchApi<{ message: string; userId: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
  },

  async login(email: string, password: string) {
    return fetchApi<{ user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    return fetchApi<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  async me() {
    return fetchApi<{ user: any }>('/auth/me');
  },

  async verifyEmail(token: string) {
    return fetchApi<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  async forgotPassword(email: string) {
    return fetchApi<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password: string) {
    return fetchApi<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
};

// ============================================================
// PROJECTS API
// ============================================================

export const projectsApi = {
  async list() {
    return fetchApi<{ projects: any[] }>('/projects');
  },

  async get(id: string) {
    return fetchApi<{ project: any }>(`/projects/${id}`);
  },

  async create(data: { type: string; title: string; description?: string }) {
    return fetchApi<{ project: any }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: any) {
    return fetchApi<{ project: any }>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return fetchApi<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================
// DOCUMENTS API
// ============================================================

export const documentsApi = {
  async list(projectId: string) {
    return fetchApi<{ documents: any[] }>(`/projects/${projectId}/documents`);
  },

  async upload(projectId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/projects/${projectId}/documents`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  },
};

// ============================================================
// CAPABILITIES API
// ============================================================

export const capabilitiesApi = {
  async get() {
    return fetchApi<any>('/capabilities');
  },
};

// ============================================================
// HEALTH CHECK
// ============================================================

export const healthApi = {
  async check() {
    return fetchApi<{ status: string; database: string }>('/health');
  },
};
