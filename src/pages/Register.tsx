import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setLocalError('');
    clearError();

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (!acceptTerms) {
      setLocalError('Debes aceptar los términos y condiciones.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await register(email, password, displayName);
      navigate('/dashboard');
    } catch {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-andalus-50 dark:bg-andalus-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-andalus-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">AC</span>
          </div>
          <h1 className="text-2xl font-bold text-andalus-900 dark:text-white">Crear cuenta</h1>
          <p className="text-andalus-600 dark:text-andalus-300 mt-2">
            Únete a Andalus Creative World
          </p>
        </div>

        <div className="card">
          {displayError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
              <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{displayError}</p>
            </div>
          )}

          <div className="mb-4 p-3 rounded-lg bg-andalus-50 dark:bg-andalus-800 border border-andalus-100 dark:border-andalus-700 flex items-start gap-2">
            <CheckCircle2 size={18} className="text-andalus-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-andalus-600 dark:text-andalus-300">
              En producción, recibirás un correo de verificación. En este entorno de desarrollo, la verificación se simula.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Tu nombre artístico"
                  required
                  autoComplete="name"
                  disabled={isSubmitting}
                  minLength={2}
                  maxLength={50}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-andalus-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="tu@correo.com"
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-andalus-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Mínimo 8 caracteres"
                  required
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-andalus-400 hover:text-andalus-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && password.length < 8 && (
                <p className="text-xs text-red-500 mt-1">Mínimo 8 caracteres</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-andalus-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Repite la contraseña"
                  required
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={e => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-andalus-300 text-andalus-600 focus:ring-andalus-500"
              />
              <span className="text-sm text-andalus-600 dark:text-andalus-300">
                Acepto los términos de servicio y la política de privacidad.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-andalus-100 dark:border-andalus-700">
            <p className="text-center text-sm text-andalus-600 dark:text-andalus-300">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-semibold text-andalus-600 dark:text-andalus-400 hover:text-andalus-800 dark:hover:text-andalus-200">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
