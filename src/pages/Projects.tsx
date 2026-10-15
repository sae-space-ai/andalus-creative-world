import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsApi } from '../api';
import type { Project, ProjectType } from '../types';
import { 
  Plus, FolderOpen, Film, Music, Video, FileText,
  Search, Filter, Trash2, MoreVertical, Edit3
} from 'lucide-react';

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: 'FILM', label: 'Película' },
  { value: 'SHORT_FILM', label: 'Cortometraje' },
  { value: 'MUSIC_VIDEO', label: 'Videoclip' },
  { value: 'MUSIC_PROJECT', label: 'Proyecto musical' },
  { value: 'OTHER', label: 'Otra obra creativa' },
];

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<ProjectType>('FILM');
  const [creating, setCreating] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.list();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const result = await projectsApi.create({
        type: newType,
        title: newTitle.trim(),
        description: newDescription.trim(),
      });
      navigate(`/projects/${result.project.id}`);
    } catch (err: any) {
      alert(err.message || 'Error al crear proyecto');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return;
    try {
      await projectsApi.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error al eliminar proyecto');
    }
  };

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || p.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-andalus-900 dark:text-white">Mis Proyectos</h1>
          <p className="text-andalus-600 dark:text-andalus-300 mt-1">
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={18} /> Nuevo proyecto
        </button>
      </div>

      {/* New Project Form */}
      {showNewForm && (
        <div className="card mb-8 border-andalus-300 dark:border-andalus-600">
          <h2 className="text-lg font-bold text-andalus-900 dark:text-white mb-4">Crear nuevo proyecto</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="new-title" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">
                Título del proyecto *
              </label>
              <input
                id="new-title"
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="input-field"
                placeholder="Nombre de tu obra"
                required
                maxLength={200}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="new-type" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">
                Tipo de proyecto
              </label>
              <select
                id="new-type"
                value={newType}
                onChange={e => setNewType(e.target.value as ProjectType)}
                className="input-field"
              >
                {PROJECT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="new-desc" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">
                Descripción
              </label>
              <textarea
                id="new-desc"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                className="input-field min-h-[80px] resize-y"
                placeholder="Describe brevemente tu proyecto..."
                maxLength={2000}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={creating || !newTitle.trim()} className="btn-primary disabled:opacity-50">
                {creating ? 'Creando...' : 'Crear proyecto'}
              </button>
              <button type="button" onClick={() => setShowNewForm(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-andalus-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Buscar proyectos..."
          />
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-andalus-400" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="input-field pl-10 pr-8 min-w-[180px]"
          >
            <option value="">Todos los tipos</option>
            {PROJECT_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 bg-andalus-100 dark:bg-andalus-700 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-andalus-100 dark:bg-andalus-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-andalus-100 dark:bg-andalus-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-16">
          <FolderOpen size={48} className="mx-auto text-andalus-300 dark:text-andalus-600 mb-4" />
          <h3 className="text-lg font-semibold text-andalus-900 dark:text-white mb-2">
            {search || filterType ? 'No se encontraron proyectos' : 'Aún no tienes proyectos'}
          </h3>
          <p className="text-andalus-500 dark:text-andalus-400 mb-6">
            {search || filterType
              ? 'Intenta con otros términos de búsqueda.'
              : 'Crea tu primer proyecto para comenzar.'}
          </p>
          {!search && !filterType && (
            <button onClick={() => setShowNewForm(true)} className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> Crear proyecto
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onDelete }: { project: Project; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const typeLabels: Record<string, string> = {
    FILM: 'Película',
    SHORT_FILM: 'Cortometraje',
    MUSIC_VIDEO: 'Videoclip',
    MUSIC_PROJECT: 'Proyecto musical',
    OTHER: 'Otra obra',
  };

  return (
    <div className="card group relative">
      <div className="flex items-start justify-between mb-2">
        <Link to={`/projects/${project.id}`} className="flex-1 pr-2">
          <h3 className="font-semibold text-andalus-900 dark:text-white truncate group-hover:text-andalus-600 dark:group-hover:text-andalus-300 transition-colors">
            {project.title}
          </h3>
        </Link>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded hover:bg-andalus-100 dark:hover:bg-andalus-700"
          >
            <MoreVertical size={16} className="text-andalus-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-40 bg-white dark:bg-andalus-800 rounded-lg shadow-xl border border-andalus-100 dark:border-andalus-700 py-1 z-10">
              <Link
                to={`/projects/${project.id}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-andalus-700 dark:text-andalus-200 hover:bg-andalus-50 dark:hover:bg-andalus-700"
              >
                <Edit3 size={14} /> Editar
              </Link>
              <button
                onClick={() => { onDelete(project.id); setMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
              >
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Link to={`/projects/${project.id}`} className="block">
        <p className="text-sm text-andalus-500 dark:text-andalus-400 line-clamp-2 mb-3">
          {project.description || 'Sin descripción'}
        </p>
      </Link>
      
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-andalus-500 dark:text-andalus-400 bg-andalus-100 dark:bg-andalus-700 px-2 py-0.5 rounded">
          {typeLabels[project.type]}
        </span>
        <span className={`status-badge ${
          project.status === 'DRAFT' ? 'status-pending' :
          project.status === 'ACTIVE' ? 'status-implemented' :
          project.status === 'PROCESSING' ? 'status-designed' : 'status-blocked'
        }`}>
          {project.status === 'DRAFT' ? 'Borrador' :
           project.status === 'ACTIVE' ? 'Activo' :
           project.status === 'PROCESSING' ? 'Procesando' : project.status}
        </span>
        <span className="text-xs text-andalus-400 ml-auto">
          {new Date(project.updatedAt).toLocaleDateString('es')}
        </span>
      </div>
    </div>
  );
}
