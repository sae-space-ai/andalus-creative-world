import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { authApi } from '../api';

export default function VerifyEmail() {
  const [token] = useState(() => new URLSearchParams(window.location.search).get('token') || '');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error' | 'expired'>(
    token ? 'idle' : 'error'
  );
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async () => {
    if (!token) return;
    setStatus('verifying');
    setErrorMessage('');
    
    try {
      await authApi.verifyEmail(token);
      setStatus('success');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('expir') || msg.toLowerCase().includes('expired')) {
        setStatus('expired');
      } else if (msg.toLowerCase().includes('inválid') || msg.toLowerCase().includes('invalid')) {
        setStatus('error');
      } else {
        setStatus('error');
        setErrorMessage(msg || 'Error al verificar el correo. Inténtalo de nuevo.');
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-andalus-900 dark:text-white mb-2">
            ¡Correo verificado!
          </h1>
          <p className="text-andalus-600 dark:text-andalus-300 mb-6">
            Tu dirección de correo ha sido verificada correctamente. Ya puedes utilizar todas las funciones de la plataforma.
          </p>
          <Link to="/login" className="btn-primary">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  if (status === 'error' || status === 'expired') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Mail size={64} className="mx-auto text-andalus-300 dark:text-andalus-600 mb-4" />
          <h1 className="text-2xl font-bold text-andalus-900 dark:text-white mb-2">
            {status === 'expired' ? 'Enlace caducado' : 'Enlace no válido'}
          </h1>
          <p className="text-andalus-600 dark:text-andalus-300 mb-2">
            {status === 'expired'
              ? 'El enlace de verificación ha caducado. Solicita uno nuevo desde tu cuenta.'
              : 'El enlace de verificación no es válido o ya ha sido utilizado.'}
          </p>
          {errorMessage && (
            <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
          )}
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Mail size={64} className="mx-auto text-andalus-600 mb-4" />
        <h1 className="text-2xl font-bold text-andalus-900 dark:text-white mb-2">
          Verificar correo electrónico
        </h1>
        <p className="text-andalus-600 dark:text-andalus-300 mb-6">
          Haz clic en el botón para confirmar tu dirección de correo electrónico.
        </p>
        <button
          onClick={handleVerify}
          disabled={status === 'verifying'}
          className="btn-primary inline-flex items-center gap-2"
        >
          {status === 'verifying' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verificando...
            </>
          ) : (
            'Verificar correo'
          )}
        </button>
      </div>
    </div>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      // Anti-enumeration: always show success message even on error
      // But log the error for debugging
      console.error('Forgot password error:', err);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Mail size={64} className="mx-auto text-andalus-600 mb-4" />
          <h1 className="text-2xl font-bold text-andalus-900 dark:text-white mb-2">
            Revisa tu correo
          </h1>
          <p className="text-andalus-600 dark:text-andalus-300 mb-6">
            Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
            El enlace caduca en 1 hora.
          </p>
          <Link to="/login" className="text-sm text-andalus-600 dark:text-andalus-400 hover:text-andalus-800 font-medium">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-andalus-900 dark:text-white">Recuperar contraseña</h1>
          <p className="text-andalus-600 dark:text-andalus-300 mt-2">
            Introduce tu correo y te enviaremos un enlace de recuperación.
          </p>
        </div>
        <div className="card">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
              <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@correo.com"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-andalus-600 dark:text-andalus-400 hover:text-andalus-800 font-medium">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const token = new URLSearchParams(window.location.search).get('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!token) {
      setError('El enlace de recuperación no es válido.');
      return;
    }
    
    if (password.length < 8) { 
      setError('La contraseña debe tener al menos 8 caracteres.'); 
      return; 
    }
    if (password !== confirm) { 
      setError('Las contraseñas no coinciden.'); 
      return; 
    }
    
    setLoading(true);
    
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('expir') || msg.toLowerCase().includes('expired')) {
        setError('El enlace ha caducado. Solicita uno nuevo.');
      } else if (msg.toLowerCase().includes('inválid') || msg.toLowerCase().includes('invalid')) {
        setError('El enlace no es válido o ya ha sido utilizado.');
      } else {
        setError(msg || 'Error al restablecer la contraseña.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-andalus-900 dark:text-white mb-2">
            Contraseña restablecida
          </h1>
          <p className="text-andalus-600 dark:text-andalus-300 mb-6">
            Tu contraseña ha sido actualizada correctamente. Todas las sesiones anteriores han sido cerradas.
          </p>
          <Link to="/login" className="btn-primary">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-andalus-900 dark:text-white">Nueva contraseña</h1>
          <p className="text-andalus-600 dark:text-andalus-300 mt-2">Introduce tu nueva contraseña.</p>
        </div>
        <div className="card">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
              <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">Nueva contraseña</label>
              <input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="input-field" 
                required 
                minLength={8}
                autoComplete="new-password"
                disabled={loading} 
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">Confirmar contraseña</label>
              <input 
                id="confirm" 
                type="password" 
                value={confirm} 
                onChange={e => setConfirm(e.target.value)} 
                className="input-field" 
                required 
                autoComplete="new-password"
                disabled={loading} 
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Guardando...' : 'Restablecer contraseña'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-andalus-600 dark:text-andalus-400 hover:text-andalus-800 font-medium">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
