import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Globe, Bell, Shield, Database } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, updatePreferences } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-andalus-900 dark:text-white mb-8">Configuración</h1>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="card">
          <h2 className="text-lg font-bold text-andalus-900 dark:text-white mb-4 flex items-center gap-2">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            Apariencia
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-andalus-900 dark:text-white">Tema</p>
              <p className="text-sm text-andalus-500">Actual: {theme === 'dark' ? 'Oscuro' : 'Claro'}</p>
            </div>
            <button onClick={toggleTheme} className="btn-outline text-sm">
              Cambiar a {theme === 'dark' ? 'claro' : 'oscuro'}
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="card">
          <h2 className="text-lg font-bold text-andalus-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe size={20} />
            Idioma
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-andalus-900 dark:text-white">Idioma de la interfaz</p>
              <p className="text-sm text-andalus-500">{user?.preferences?.locale === 'es' ? 'Español' : 'English'}</p>
            </div>
            <select
              value={user?.preferences?.locale || 'es'}
              onChange={e => updatePreferences({ locale: e.target.value })}
              className="input-field w-auto"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <p className="text-xs text-andalus-400 mt-2">
            Arquitectura de internacionalización preparada. Más idiomas disponibles en futuras fases.
          </p>
        </div>

        {/* Notifications */}
        <div className="card">
          <h2 className="text-lg font-bold text-andalus-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell size={20} />
            Notificaciones
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-andalus-700 dark:text-andalus-200">Notificaciones por correo</span>
              <input
                type="checkbox"
                checked={user?.preferences?.notifications ?? true}
                onChange={e => updatePreferences({ notifications: e.target.checked })}
                className="w-5 h-5 rounded border-andalus-300 text-andalus-600 focus:ring-andalus-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-andalus-700 dark:text-andalus-200">Alertas de procesamiento</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-andalus-300 text-andalus-600 focus:ring-andalus-500" />
            </label>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="card">
          <h2 className="text-lg font-bold text-andalus-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield size={20} />
            Privacidad y datos
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-andalus-600 dark:text-andalus-300">
              Tus proyectos son privados por defecto. Los documentos subidos no se publican automáticamente.
            </p>
            <div className="flex gap-3">
              <button className="btn-outline text-sm">Exportar mis datos</button>
              <button className="text-sm text-red-600 dark:text-red-400 hover:underline">Eliminar mi cuenta</button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <h2 className="text-lg font-bold text-andalus-900 dark:text-white mb-4 flex items-center gap-2">
            <Database size={20} />
            Estado del sistema
          </h2>
          <div className="space-y-2">
            <SystemStatus label="Autenticación" status="implemented" />
            <SystemStatus label="Proyectos" status="implemented" />
            <SystemStatus label="Procesamiento PDF" status="implemented" />
            <SystemStatus label="Google OIDC" status="configuration_required" />
            <SystemStatus label="Stripe TEST" status="configuration_required" />
            <SystemStatus label="Módulos Cinema-Trace" status="designed" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemStatus({ label, status }: { label: string; status: string }) {
  const colors: Record<string, string> = {
    implemented: 'bg-green-500',
    configuration_required: 'bg-yellow-500',
    designed: 'bg-blue-500',
    blocked: 'bg-red-500',
  };
  
  const labels: Record<string, string> = {
    implemented: 'Implementado',
    configuration_required: 'Requiere configuración',
    designed: 'Diseñado',
    blocked: 'Bloqueado',
  };

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-andalus-700 dark:text-andalus-200">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${colors[status]}`}></div>
        <span className="text-xs text-andalus-500">{labels[status]}</span>
      </div>
    </div>
  );
}
