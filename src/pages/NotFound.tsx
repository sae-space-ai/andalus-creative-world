import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-andalus-200 dark:text-andalus-700 mb-4">404</div>
        <h1 className="text-2xl font-bold text-andalus-900 dark:text-white mb-2">
          Página no encontrada
        </h1>
        <p className="text-andalus-600 dark:text-andalus-300 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <Home size={18} /> Ir al inicio
          </Link>
          <button onClick={() => window.history.back()} className="btn-outline inline-flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}
