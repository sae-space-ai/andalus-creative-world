import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Shield, CheckCircle2 } from 'lucide-react';

export default function Account() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ displayName });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-andalus-900 dark:text-white mb-8">Mi Cuenta</h1>

      <div className="space-y-6">
        {/* Profile */}
        <div className="card">
          <h2 className="text-lg font-bold text-andalus-900 dark:text-white mb-4">Perfil</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">
                Nombre visible
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-andalus-400" />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="input-field pl-10"
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-andalus-400" />
                <input
                  type="email"
                  value={user?.email || ''}
                  className="input-field pl-10 bg-andalus-50 dark:bg-andalus-700/50"
                  disabled
                />
              </div>
              <p className="text-xs text-andalus-500 mt-1">El correo no se puede cambiar desde aquí.</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              {saved && (
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Guardado
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-andalus-900 dark:text-white mb-4">Información de la cuenta</h2>
          <div className="space-y-3">
            <InfoRow icon={User} label="Rol" value={user?.role || 'USER'} />
            <InfoRow icon={Shield} label="Estado" value={user?.status || 'ACTIVE'} />
            <InfoRow icon={Calendar} label="Miembro desde" value={new Date(user?.createdAt || '').toLocaleDateString('es')} />
            <InfoRow 
              icon={CheckCircle2} 
              label="Correo verificado" 
              value={user?.emailVerifiedAt ? `Sí (${new Date(user.emailVerifiedAt).toLocaleDateString('es')})` : 'Pendiente'} 
            />
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <h2 className="text-lg font-bold text-andalus-900 dark:text-white mb-4">Seguridad</h2>
          <div className="space-y-3">
            <p className="text-sm text-andalus-600 dark:text-andalus-300">
              Tu contraseña está protegida con hash Argon2id. Las sesiones utilizan cookies HttpOnly seguras.
            </p>
            <div className="flex gap-3">
              <button className="btn-outline text-sm">Cambiar contraseña</button>
              <button className="btn-outline text-sm">Cerrar todas las sesiones</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon size={16} className="text-andalus-500" />
      <span className="text-sm text-andalus-500 w-36">{label}</span>
      <span className="text-sm font-medium text-andalus-900 dark:text-white">{value}</span>
    </div>
  );
}
