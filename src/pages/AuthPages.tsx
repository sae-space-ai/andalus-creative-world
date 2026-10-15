import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, ArrowLeft } from 'lucide-react';

export default function VerifyEmail() {
  const [token] = useState(() => new URLSearchParams(window.location.search).get('token') || '');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error' | 'expired'>(
    token ? 'idle' : 'error'
  );

  const handleVerify = async () => {
    if (!token) return;
    setStatus('verifying');
    // Simulate verification
    await new Promise(r => setTimeout(r, 1500));
    setStatus('success');
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
          <Link to="/dashboard" className="btn-primary">Ir al Dashboard</Link>
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
            Enlace no válido
          </h1>
          <p className="text-andalus-600 dark:text-andalus-300 mb-6">
            {status === 'expired'
              ? 'El enlace de verificación ha caducado. Solicita uno nuevo.'
              : 'El enlace de verificación no es válido o ha caducado.'}
          </p>
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
          Haz clic en el botón para verificar tu dirección de correo electrónico.
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Mínimo 8 caracteres.'); return; }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setDone(true);
    setLoading(false);
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
            Tu contraseña ha sido actualizada correctamente.
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
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">Nueva contraseña</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" required minLength={8} disabled={loading} />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-andalus-700 dark:text-andalus-200 mb-1.5">Confirmar contraseña</label>
              <input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="input-field" required disabled={loading} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Guardando...' : 'Restablecer contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
