import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsApi } from '../api';
import type { Project } from '../types';
import { 
  FolderOpen, Plus, Film, Music, Video, FileText, 
  ArrowRight, Clock, AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const data = await projectsApi.list(user.id);
        setProjects(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const recentProjects = projects.slice(0, 4);
  const stats = {
    total: projects.length,
    drafts: projects.filter(p => p.status === 'DRAFT').length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    processing: projects.filter(p => p.status === 'PROCESSING').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-andalus-900 dark:text-white">
          Hola, {user?.displayName} 👋
        </h1>
        <p className="text-andalus-600 dark:text-andalus-300 mt-1">
          Bienvenido a tu espacio creativo en Andalus Creative World.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total proyectos" value={stats.total} icon={FolderOpen} color="andalus" />
        <StatCard label="Borradores" value={stats.drafts} icon={FileText} color="yellow" />
        <StatCard label="Activos" value={stats.active} icon={Film} color="green" />
        <StatCard label="Procesando" value={stats.processing} icon={Clock} color="blue" />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link to="/projects/new" className="card-hover flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-andalus-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={22} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-andalus-900 dark:text-white">Nuevo proyecto</p>
            <p className="text-sm text-andalus-500">Crea un proyecto creativo</p>
          </div>
        </Link>
        <Link to="/projects" className="card-hover flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-andalus-100 dark:bg-andalus-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FolderOpen size={22} className="text-andalus-600 dark:text-andalus-300" />
          </div>
          <div>
            <p className="font-semibold text-andalus-900 dark:text-white">Mis proyectos</p>
            <p className="text-sm text-andalus-500">Ver y gestionar proyectos</p>
          </div>
        </Link>
        <Link to="/cinema" className="card-hover flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 dark:bg-gold-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Film size={22} className="text-gold-500" />
          </div>
          <div>
            <p className="font-semibold text-andalus-900 dark:text-white">Andalus Cinema</p>
            <p className="text-sm text-andalus-500">Producción audiovisual</p>
          </div>
        </Link>
      </div>

      {/* Recent Projects */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-andalus-900 dark:text-white">Proyectos recientes</h2>
          {projects.length > 0 && (
            <Link to="/projects" className="text-sm font-medium text-andalus-600 dark:text-andalus-400 hover:text-andalus-800 dark:hover:text-andalus-200 flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-andalus-100 dark:bg-andalus-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-andalus-100 dark:bg-andalus-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recentProjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {recentProjects.map(project => (
              <Link key={project.id} to={`/projects/${project.id}`} className="card-hover">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-andalus-900 dark:text-white truncate pr-2">{project.title}</h3>
                  <ProjectTypeIcon type={project.type} />
                </div>
                <p className="text-sm text-andalus-500 dark:text-andalus-400 line-clamp-2 mb-3">
                  {project.description || 'Sin descripción'}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`status-badge ${
                    project.status === 'DRAFT' ? 'status-pending' :
                    project.status === 'ACTIVE' ? 'status-implemented' :
                    'status-designed'
                  }`}>
                    {project.status === 'DRAFT' ? 'Borrador' :
                     project.status === 'ACTIVE' ? 'Activo' :
                     project.status === 'PROCESSING' ? 'Procesando' : project.status}
                  </span>
                  <span className="text-xs text-andalus-400">
                    {new Date(project.createdAt).toLocaleDateString('es')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FolderOpen size={48} className="mx-auto text-andalus-300 dark:text-andalus-600 mb-4" />
            <h3 className="text-lg font-semibold text-andalus-900 dark:text-white mb-2">
              Aún no tienes proyectos
            </h3>
            <p className="text-andalus-500 dark:text-andalus-400 mb-6">
              Crea tu primer proyecto para comenzar a trabajar.
            </p>
            <Link to="/projects/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> Crear proyecto
            </Link>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="card bg-andalus-50 dark:bg-andalus-800/50 border-andalus-200 dark:border-andalus-700">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-gold-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-andalus-900 dark:text-white text-sm mb-1">FASE 00 — Estado del sistema</h4>
            <p className="text-sm text-andalus-600 dark:text-andalus-300">
              Los módulos Cinema, Community, Festivals, Rights, Trace y Wallet están en fase de diseño (DESIGNED). 
              Google OIDC y Stripe TEST requieren configuración de credenciales (CONFIGURATION_REQUIRED). 
              La autenticación por email, proyectos y procesamiento de PDF están implementados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  const colors: Record<string, string> = {
    andalus: 'bg-andalus-100 dark:bg-andalus-700 text-andalus-600 dark:text-andalus-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300',
  };
  
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-2xl font-bold text-andalus-900 dark:text-white">{value}</p>
          <p className="text-xs text-andalus-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ProjectTypeIcon({ type }: { type: string }) {
  const icons: Record<string, any> = {
    FILM: Film,
    SHORT_FILM: Video,
    MUSIC_VIDEO: Music,
    MUSIC_PROJECT: Music,
    OTHER: FileText,
  };
  const Icon = icons[type] || FileText;
  return <Icon size={18} className="text-andalus-400 flex-shrink-0" />;
}
