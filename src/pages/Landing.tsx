import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Film, Clapperboard, Users, Trophy, Shield, Eye, Wallet,
  ArrowRight, Sparkles, Lock, Zap, Globe, CheckCircle2
} from 'lucide-react';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-andalus-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-andalus-500 rounded-full blur-[120px] opacity-30"></div>
        </div>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(201,168,76,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0,168,99,0.3) 0%, transparent 50%)'}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles size={14} className="text-gold-400" />
              <span className="text-sm text-white/90">AL-ANDALUS AI — Intelligence · Engineering · Europe</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Andalus Creative
              <span className="block text-gradient">World</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-andalus-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              La plataforma integral de creación audiovisual. Transforma tus obras en producciones 
              cinematográficas con inteligencia artificial, gestión de derechos y distribución global.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-gold text-base px-8 py-3 inline-flex items-center justify-center gap-2">
                  Ir al Dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-gold text-base px-8 py-3 inline-flex items-center justify-center gap-2">
                    Comenzar ahora <ArrowRight size={18} />
                  </Link>
                  <Link to="/login" className="px-8 py-3 text-base font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all inline-flex items-center justify-center">
                    Iniciar sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" 
              className="fill-white dark:fill-andalus-900" />
          </svg>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-andalus-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-andalus-900 dark:text-white mb-4">
              Ecosistema Creativo Completo
            </h2>
            <p className="text-lg text-andalus-600 dark:text-andalus-300 max-w-2xl mx-auto">
              Siete módulos integrados que cubren todo el ciclo de vida de una obra creativa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ModuleCard
              icon={Film}
              title="Andalus Cinema"
              description="Producción audiovisual y adaptación de libros a películas y cortometrajes."
              status="DESIGNED"
              to="/cinema"
            />
            <ModuleCard
              icon={Clapperboard}
              title="Andalus Cinema+"
              description="Estrenos, exhibición y distribución de obras audiovisuales."
              status="DESIGNED"
              to="/cinema-plus"
            />
            <ModuleCard
              icon={Users}
              title="Andalus Community"
              description="Red de creadores, colaboración y proyectos compartidos."
              status="DESIGNED"
              to="/community"
            />
            <ModuleCard
              icon={Trophy}
              title="Andalus Festivals"
              description="Concursos y festivales artísticos con jurado y votación."
              status="DESIGNED"
              to="/festivals"
            />
            <ModuleCard
              icon={Shield}
              title="Andalus Rights"
              description="Gestión de titularidad, licencias y autorizaciones."
              status="DESIGNED"
              to="/rights"
            />
            <ModuleCard
              icon={Eye}
              title="Andalus Trace 360°"
              description="Identificación, seguimiento y rendimiento verificable de obras."
              status="DESIGNED"
              to="/trace"
            />
            <ModuleCard
              icon={Wallet}
              title="Andalus Wallet"
              description="Ganancias de creadores y operaciones financieras autorizadas."
              status="DESIGNED"
              to="/wallet"
            />
            <div className="card-hover flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 rounded-xl bg-andalus-100 dark:bg-andalus-700 flex items-center justify-center mb-4">
                <Zap size={24} className="text-andalus-600 dark:text-andalus-300" />
              </div>
              <h3 className="font-bold text-andalus-900 dark:text-white mb-2">FASE 00 Activa</h3>
              <p className="text-sm text-andalus-600 dark:text-andalus-300">
                Autenticación, proyectos, PDF y arquitectura base operativos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-20 bg-andalus-50 dark:bg-andalus-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-andalus-900 dark:text-white mb-6">
                Tecnología real, resultados verificables
              </h2>
              <p className="text-andalus-600 dark:text-andalus-300 mb-8 leading-relaxed">
                Cada funcionalidad está diseñada para ser transparente, segura y auditable. 
                No prometemos lo que no podemos demostrar.
              </p>
              <ul className="space-y-4">
                {[
                  'Registro y autenticación segura con Argon2id',
                  'Proyectos privados con aislamiento de datos',
                  'Subida y procesamiento real de PDF',
                  'Extracción de texto por página',
                  'Declaración de derechos sobre obras',
                  'Ledger de créditos con idempotencia',
                  'Modo claro y oscuro',
                  'Diseño responsive y accesible',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-andalus-600 dark:text-andalus-400 mt-0.5 flex-shrink-0" />
                    <span className="text-andalus-700 dark:text-andalus-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="card p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-andalus-50 dark:bg-andalus-700/50">
                    <Lock size={18} className="text-andalus-600" />
                    <div>
                      <p className="text-sm font-medium text-andalus-900 dark:text-white">Seguridad por diseño</p>
                      <p className="text-xs text-andalus-500">CSRF, rate limiting, cookies seguras</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-andalus-50 dark:bg-andalus-700/50">
                    <Globe size={18} className="text-andalus-600" />
                    <div>
                      <p className="text-sm font-medium text-andalus-900 dark:text-white">Internacionalización</p>
                      <p className="text-xs text-andalus-500">Español inicial, multi-idioma preparado</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-andalus-50 dark:bg-andalus-700/50">
                    <Zap size={18} className="text-andalus-600" />
                    <div>
                      <p className="text-sm font-medium text-andalus-900 dark:text-white">Arquitectura ampliable</p>
                      <p className="text-xs text-andalus-500">Módulos independientes y extensibles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-andalus-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-andalus-900 dark:text-white mb-4">
            Comienza a crear
          </h2>
          <p className="text-lg text-andalus-600 dark:text-andalus-300 mb-8">
            Regístrate, crea tu primer proyecto y sube tu obra para comenzar el proceso creativo.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Crear cuenta gratuita <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function ModuleCard({ icon: Icon, title, description, status, to }: {
  icon: any;
  title: string;
  description: string;
  status: string;
  to: string;
}) {
  return (
    <Link to={to} className="card-hover group">
      <div className="w-12 h-12 rounded-xl bg-andalus-100 dark:bg-andalus-700 flex items-center justify-center mb-4 group-hover:bg-andalus-600 transition-colors">
        <Icon size={22} className="text-andalus-600 dark:text-andalus-300 group-hover:text-white transition-colors" />
      </div>
      <h3 className="font-bold text-andalus-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-andalus-600 dark:text-andalus-300 mb-3">{description}</p>
      <span className={`status-${status === 'DESIGNED' ? 'designed' : 'implemented'}`}>
        {status}
      </span>
    </Link>
  );
}
