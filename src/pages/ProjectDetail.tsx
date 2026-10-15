import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsApi, documentsApi } from '../api';
import type { Project, SourceDocument, RightsType } from '../types';
import { 
  ArrowLeft, Edit3, Trash2, Upload, FileText, CheckCircle2,
  AlertTriangle, Clock, Shield, Save, X, Film, Music, Video
} from 'lucide-react';

const RIGHTS_OPTIONS: { value: RightsType; label: string; description: string }[] = [
  { value: 'OWN_WORK', label: 'Obra propia', description: 'Soy el autor/a original de esta obra.' },
  { value: 'PUBLIC_DOMAIN', label: 'Dominio público', description: 'La obra se encuentra en dominio público.' },
  { value: 'LICENSED', label: 'Licencia válida', description: 'Dispongo de una licencia que me autoriza.' },
  { value: 'AUTHORIZED', label: 'Autorización del titular', description: 'Tengo autorización expresa del titular de los derechos.' },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<SourceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showRightsForm, setShowRightsForm] = useState(false);
  const [selectedRights, setSelectedRights] = useState<RightsType>('OWN_WORK');
  const [rightsNotes, setRightsNotes] = useState('');
  const [notFound, setNotFound] = useState(false);

  const loadProject = async () => {
    if (!user || !id) return;
    setLoading(true);
    try {
      const data = await projectsApi.get(id, user.id);
      if (!data) {
        setNotFound(true);
        return;
      }
      setProject(data);
      setEditTitle(data.title);
      setEditDescription(data.description);
      
      const docs = await documentsApi.list(id, user.id);
      setDocuments(docs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProject(); }, [user, id]);

  // Refresh documents periodically to show processing status
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!user || !id) return;
      const docs = await documentsApi.list(id, user.id);
      setDocuments(docs);
    }, 3000);
    return () => clearInterval(interval);
  }, [user, id]);

  const handleSave = async () => {
    if (!user || !id || !editTitle.trim()) return;
    setSaving(true);
    try {
      const updated = await projectsApi.update(id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      }, user.id);
      if (updated) {
        setProject(updated);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !id) return;
    if (!confirm('¿Eliminar este proyecto y todos sus documentos? Esta acción no se puede deshacer.')) return;
    await projectsApi.delete(id, user.id);
    navigate('/projects');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !id) return;
    
    setUploadError('');
    setUploading(true);
    
    try {
      const doc = await documentsApi.upload(id, file, user.id);
      setDocuments(prev => [...prev, doc]);
      
      // Refresh to get updated status
      setTimeout(async () => {
        const docs = await documentsApi.list(id, user.id);
        setDocuments(docs);
      }, 3500);
    } catch (err: any) {
      setUploadError(err.message || 'Error al subir el archivo.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRightsDeclaration = async () => {
    if (!user || !id || !project) return;
    // In production this would be a real API call
    const updated = await projectsApi.update(id, {
      // @ts-ignore - rightsDeclaration not in update type but handled
    } as any, user.id);
    
    // Simulate rights declaration
    setProject({
      ...project,
      rightsDeclaration: {
        type: selectedRights,
        declaredAt: new Date().toISOString(),
        notes: rightsNotes,
      },
    });
    setShowRightsForm(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-andalus-100 dark:bg-andalus-700 rounded w-1/3"></div>
          <div className="h-4 bg-andalus-100 dark:bg-andalus-700 rounded w-2/3"></div>
          <div className="h-32 bg-andalus-100 dark:bg-andalus-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <FileText size={48} className="mx-auto text-andalus-300 dark:text-andalus-600 mb-4" />
        <h1 className="text-2xl font-bold text-andalus-900 dark:text-white mb-2">Proyecto no encontrado</h1>
        <p className="text-andalus-500 dark:text-andalus-400 mb-6">
          El proyecto que buscas no existe o no tienes permisos para acceder.
        </p>
        <Link to="/projects" className="btn-primary">Volver a proyectos</Link>
      </div>
    );
  }

  const typeIcons: Record<string, any> = { FILM: Film, SHORT_FILM: Video, MUSIC_VIDEO: Music, MUSIC_PROJECT: Music, OTHER: FileText };
  const TypeIcon = typeIcons[project.type] || Film;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-andalus-600 dark:text-andalus-400 hover:text-andalus-800 dark:hover:text-andalus-200 mb-6">
        <ArrowLeft size={16} /> Volver a proyectos
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          {editing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="input-field text-xl font-bold"
                maxLength={200}
              />
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                className="input-field min-h-[60px] resize-y"
                placeholder="Descripción del proyecto..."
                maxLength={2000}
              />
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="btn-primary text-sm inline-flex items-center gap-1">
                  <Save size={14} /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => { setEditing(false); setEditTitle(project.title); setEditDescription(project.description); }} className="btn-secondary text-sm">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <TypeIcon size={20} className="text-andalus-600" />
                <span className="text-sm text-andalus-500">{project.type.replace('_', ' ')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-andalus-900 dark:text-white">{project.title}</h1>
              <p className="text-andalus-600 dark:text-andalus-300 mt-2">{project.description || 'Sin descripción'}</p>
            </>
          )}
        </div>
        {!editing && (
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="p-2 rounded-lg hover:bg-andalus-100 dark:hover:bg-andalus-700" title="Editar">
              <Edit3 size={18} className="text-andalus-600 dark:text-andalus-300" />
            </button>
            <button onClick={handleDelete} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20" title="Eliminar">
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
        )}
      </div>

      {/* Status & Rights */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="card">
          <h3 className="text-sm font-semibold text-andalus-500 dark:text-andalus-400 mb-2">Estado</h3>
          <span className={`status-badge ${
            project.status === 'DRAFT' ? 'status-pending' :
            project.status === 'ACTIVE' ? 'status-implemented' : 'status-designed'
          }`}>
            {project.status}
          </span>
          <p className="text-xs text-andalus-400 mt-2">
            Creado: {new Date(project.createdAt).toLocaleDateString('es')}
          </p>
          <p className="text-xs text-andalus-400">
            Visibilidad: {project.visibility}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-andalus-500 dark:text-andalus-400 mb-2">
            <Shield size={14} className="inline mr-1" /> Derechos sobre la obra
          </h3>
          {project.rightsDeclaration ? (
            <div>
              <p className="text-sm text-andalus-700 dark:text-andalus-200 font-medium">
                {RIGHTS_OPTIONS.find(r => r.value === project.rightsDeclaration?.type)?.label}
              </p>
              <p className="text-xs text-andalus-400 mt-1">
                Declarado: {new Date(project.rightsDeclaration.declaredAt).toLocaleDateString('es')}
              </p>
            </div>
          ) : (
            <button onClick={() => setShowRightsForm(true)} className="text-sm text-andalus-600 dark:text-andalus-400 font-medium hover:text-andalus-800">
              Declarar derechos →
            </button>
          )}
        </div>
      </div>

      {/* Rights Declaration Form */}
      {showRightsForm && (
        <div className="card mb-8 border-gold-500/30 bg-gold-500/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-andalus-900 dark:text-white flex items-center gap-2">
              <Shield size={18} className="text-gold-500" /> Declaración de derechos
            </h3>
            <button onClick={() => setShowRightsForm(false)} className="p-1 hover:bg-andalus-100 dark:hover:bg-andalus-700 rounded">
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-andalus-600 dark:text-andalus-300 mb-4">
            Antes de procesar tu obra, declara tu relación con los derechos de la misma. 
            Esta declaración es necesaria pero no constituye prueba definitiva de titularidad.
          </p>
          <div className="space-y-2 mb-4">
            {RIGHTS_OPTIONS.map(opt => (
              <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedRights === opt.value
                  ? 'border-andalus-500 bg-andalus-50 dark:bg-andalus-800'
                  : 'border-andalus-200 dark:border-andalus-600 hover:border-andalus-300'
              }`}>
                <input
                  type="radio"
                  name="rights"
                  value={opt.value}
                  checked={selectedRights === opt.value}
                  onChange={() => setSelectedRights(opt.value)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-andalus-900 dark:text-white">{opt.label}</p>
                  <p className="text-xs text-andalus-500">{opt.description}</p>
                </div>
              </label>
            ))}
          </div>
          <textarea
            value={rightsNotes}
            onChange={e => setRightsNotes(e.target.value)}
            className="input-field min-h-[60px] mb-4"
            placeholder="Notas adicionales (opcional)..."
          />
          <button onClick={handleRightsDeclaration} className="btn-primary text-sm">
            Confirmar declaración
          </button>
        </div>
      )}

      {/* Documents Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-andalus-900 dark:text-white mb-4">Documentos</h2>
        
        {/* Upload */}
        <div className="card mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1">Subir PDF</p>
              <p className="text-xs text-andalus-500">Máximo 50 MB. Solo archivos PDF.</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className={`btn-outline text-sm inline-flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Upload size={16} />
              {uploading ? 'Subiendo...' : 'Seleccionar PDF'}
            </label>
          </div>
          {uploadError && (
            <div className="mt-3 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle size={14} /> {uploadError}
            </div>
          )}
        </div>

        {/* Documents List */}
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map(doc => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <FileText size={36} className="mx-auto text-andalus-300 dark:text-andalus-600 mb-3" />
            <p className="text-andalus-500 dark:text-andalus-400 text-sm">
              No hay documentos. Sube un PDF para comenzar el procesamiento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentCard({ document: doc }: { document: SourceDocument }) {
  const statusConfig: Record<string, { icon: any; label: string; color: string }> = {
    PENDING: { icon: Clock, label: 'Pendiente', color: 'text-yellow-500' },
    PROCESSING: { icon: Clock, label: 'Procesando...', color: 'text-blue-500' },
    COMPLETED: { icon: CheckCircle2, label: 'Completado', color: 'text-green-500' },
    FAILED: { icon: AlertTriangle, label: 'Error', color: 'text-red-500' },
    NEEDS_OCR: { icon: AlertTriangle, label: 'Necesita OCR', color: 'text-orange-500' },
  };

  const config = statusConfig[doc.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <div className="card flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
        <FileText size={20} className="text-red-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-andalus-900 dark:text-white truncate">{doc.originalName}</p>
        <div className="flex items-center gap-3 text-xs text-andalus-500 mt-1">
          <span>{(doc.sizeBytes / 1024).toFixed(1)} KB</span>
          <span>SHA-256: {doc.checksum.slice(0, 16)}...</span>
          {doc.pageCount > 0 && <span>{doc.pageCount} págs.</span>}
        </div>
      </div>
      <div className={`flex items-center gap-1.5 ${config.color}`}>
        <StatusIcon size={16} />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    </div>
  );
}
