import { Link } from 'react-router-dom';
import { 
  Film, Clapperboard, Users, Trophy, Shield, Eye, Wallet,
  ArrowRight, CheckCircle2, Clock, AlertCircle, Info
} from 'lucide-react';
import type { CapabilityStatus } from '../types';

interface ModulePageProps {
  moduleId: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  status: CapabilityStatus;
  features: { name: string; description: string; status: CapabilityStatus }[];
  futureCapabilities: string[];
  color: string;
}

function ModulePage({ title, subtitle, description, icon: Icon, status, features, futureCapabilities, color }: ModulePageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className={`w-20 h-20 rounded-2xl ${color} flex items-center justify-center mx-auto mb-6`}>
          <Icon size={36} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-andalus-900 dark:text-white mb-3">{title}</h1>
        <p className="text-lg text-andalus-600 dark:text-andalus-300 mb-4">{subtitle}</p>
        <p className="text-andalus-500 dark:text-andalus-400 max-w-2xl mx-auto">{description}</p>
        <div className="mt-4">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Current Features */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-andalus-900 dark:text-white mb-6">Capacidades</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="card">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-andalus-900 dark:text-white">{feature.name}</h3>
                <StatusBadge status={feature.status} small />
              </div>
              <p className="text-sm text-andalus-500 dark:text-andalus-400 mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Future Capabilities */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-andalus-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock size={20} /> Capacidades futuras
        </h2>
        <div className="card bg-andalus-50 dark:bg-andalus-800/50">
          <ul className="space-y-3">
            {futureCapabilities.map((cap, i) => (
              <li key={i} className="flex items-start gap-3">
                <Clock size={16} className="text-andalus-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-andalus-600 dark:text-andalus-300">{cap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Architecture Note */}
      <div className="card bg-andalus-50 dark:bg-andalus-800/50 border-andalus-200 dark:border-andalus-700">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-andalus-600 dark:text-andalus-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-andalus-900 dark:text-white text-sm mb-1">Arquitectura preparada</h4>
            <p className="text-sm text-andalus-600 dark:text-andalus-300">
              Este módulo está diseñado y sus contratos están definidos en la arquitectura del sistema. 
              La implementación funcional completa se realizará en fases posteriores con los motores 
              y servicios externos necesarios.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
          Ir al Dashboard <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status, small }: { status: CapabilityStatus; small?: boolean }) {
  const config: Record<CapabilityStatus, { label: string; class: string }> = {
    DESIGNED: { label: 'Diseñado', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    NOT_STARTED: { label: 'No iniciado', class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
    IMPLEMENTED: { label: 'Implementado', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    CONFIGURATION_REQUIRED: { label: 'Requiere configuración', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    BLOCKED: { label: 'Bloqueado', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    TESTED: { label: 'Probado', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    VERIFIED: { label: 'Verificado', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    DISABLED: { label: 'Deshabilitado', class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  };
  
  const { label, class: cls } = config[status];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium ${cls} ${small ? 'text-xs' : 'text-sm'}`}>
      {status === 'IMPLEMENTED' || status === 'VERIFIED' ? <CheckCircle2 size={small ? 12 : 14} /> :
       status === 'CONFIGURATION_REQUIRED' ? <AlertCircle size={small ? 12 : 14} /> :
       <Clock size={small ? 12 : 14} />}
      {label}
    </span>
  );
}

// Module Pages
export function CinemaPage() {
  return (
    <ModulePage
      moduleId="cinema"
      title="Andalus Cinema"
      subtitle="Producción audiovisual y adaptación de libros"
      description="Transforma libros, novelas y manuscritos en producciones audiovisuales coherentes. Desde la ingesta del texto hasta el renderizado final, pasando por guion, storyboard, generación visual y montaje."
      icon={Film}
      status="DESIGNED"
      color="bg-andalus-600"
      features={[
        { name: 'Ingesta de libro', description: 'Carga y extracción de capítulos de la obra original.', status: 'DESIGNED' },
        { name: 'Análisis de estructura', description: 'Identificación de personajes, escenarios y trama.', status: 'DESIGNED' },
        { name: 'Adaptación de guion', description: 'Conversión narrativa a formato cinematográfico.', status: 'DESIGNED' },
        { name: 'Biblia Cinematográfica', description: 'Fuente central de continuidad: personajes, escenarios, cronología.', status: 'DESIGNED' },
        { name: 'Storyboard y planificación', description: 'Planificación visual de escenas y planos.', status: 'DESIGNED' },
        { name: 'Generación visual', description: 'Creación de assets visuales con motores de IA.', status: 'DESIGNED' },
        { name: 'Producción de audio', description: 'Voces, diálogos, música y efectos.', status: 'DESIGNED' },
        { name: 'Montaje y renderizado', description: 'Ensamblaje final y exportación de la producción.', status: 'DESIGNED' },
      ]}
      futureCapabilities={[
        'Biblia Cinematográfica Viva con versionado de personajes y escenarios',
        'Producción por etapas con estados verificables (INGESTED → COMPLETED)',
        'Presupuestos de cómputo y autorización antes de ejecutar',
        'Control de calidad y revisión humana en cada etapa',
        'Película Nº 001 como producción de referencia',
        'Soporte para largometrajes con continuidad narrativa',
        'Separación de texto fuente, adaptación y recursos generados',
      ]}
    />
  );
}

export function CinemaPlusPage() {
  return (
    <ModulePage
      moduleId="cinema-plus"
      title="Andalus Cinema+"
      subtitle="Estrenos, exhibición y distribución"
      description="Módulo de exhibición audiovisual para estrenos, catálogo, reproducción y distribución de obras. Los usuarios deciden si publican y cómo distribuyen sus creaciones."
      icon={Clapperboard}
      status="DESIGNED"
      color="bg-andalus-700"
      features={[
        { name: 'Catálogo de obras', description: 'Listado público de producciones disponibles.', status: 'DESIGNED' },
        { name: 'Fichas de obras', description: 'Información detallada, tráilers y metadatos.', status: 'DESIGNED' },
        { name: 'Reproductor', description: 'Reproducción de vídeo con controles y calidad adaptable.', status: 'DESIGNED' },
        { name: 'Autorizaciones de acceso', description: 'Control de quién puede ver cada obra.', status: 'DESIGNED' },
        { name: 'Distribución', description: 'Gestión de canales y territorios de distribución.', status: 'DESIGNED' },
        { name: 'Estadísticas', description: 'Datos verificables de reproducciones y audiencia.', status: 'DESIGNED' },
      ]}
      futureCapabilities={[
        'Fechas de estreno y cuenta atrás',
        'Alquileres y modelos de acceso',
        'Licencias territoriales',
        'Ingresos y repartos automáticos',
        'Retirada de obras por el creador',
        'Moderación y protección de derechos',
      ]}
    />
  );
}

export function CommunityPage() {
  return (
    <ModulePage
      moduleId="community"
      title="Andalus Community"
      subtitle="Comunidad de creadores y colaboración"
      description="Red social especializada en creadores audiovisuales y artísticos. Perfiles, portfolios, colaboraciones y proyectos compartidos con control total de privacidad."
      icon={Users}
      status="DESIGNED"
      color="bg-andalus-500"
      features={[
        { name: 'Perfiles artísticos', description: 'Biografías, portfolios y obras destacadas.', status: 'DESIGNED' },
        { name: 'Publicaciones', description: 'Contenido compartido explícitamente por el creador.', status: 'DESIGNED' },
        { name: 'Equipos de creación', description: 'Formación de equipos para proyectos colaborativos.', status: 'DESIGNED' },
        { name: 'Mensajería', description: 'Comunicación privada entre creadores.', status: 'DESIGNED' },
        { name: 'Notificaciones', description: 'Alertas de actividad relevante.', status: 'DESIGNED' },
        { name: 'Moderación', description: 'Sistema de denuncias, bloqueos y moderación.', status: 'DESIGNED' },
      ]}
      futureCapabilities={[
        'Seguidores y sistema de recomendaciones',
        'Comentarios y reacciones',
        'Invitaciones a proyectos',
        'Proyectos compartidos con permisos granulares',
        'Los manuscritos privados nunca se comparten implícitamente',
        'Preferencias de privacidad configurables',
      ]}
    />
  );
}

export function FestivalsPage() {
  return (
    <ModulePage
      moduleId="festivals"
      title="Andalus Festivals"
      subtitle="Concursos y festivales artísticos"
      description="Plataforma para concursos y festivales de cine, cortometrajes, música y otras disciplinas creativas. Con jurado, votación popular y protección antifraude."
      icon={Trophy}
      status="DESIGNED"
      color="bg-gold-500"
      features={[
        { name: 'Organizadores', description: 'Gestión de festivales propios y externos verificados.', status: 'DESIGNED' },
        { name: 'Inscripciones', description: 'Requisitos de elegibilidad y plazos.', status: 'DESIGNED' },
        { name: 'Jurados', description: 'Evaluación profesional con rúbricas.', status: 'DESIGNED' },
        { name: 'Votación popular', description: 'Participación del público separada del jurado.', status: 'DESIGNED' },
        { name: 'Protección antifraude', description: 'Mecanismos que impiden comprar votos.', status: 'DESIGNED' },
        { name: 'Certificados', description: 'Acreditación de ganadores y finalistas.', status: 'DESIGNED' },
      ]}
      futureCapabilities={[
        'Múltiples categorías y disciplinas',
        'Calendarios y bases oficiales',
        'Auditoría completa del proceso',
        'Sistema de reclamaciones',
        'Revisión legal antes de activar premios',
        'Separación obligatoria entre puntuación del jurado y voto popular',
      ]}
    />
  );
}

export function RightsPage() {
  return (
    <ModulePage
      moduleId="rights"
      title="Andalus Rights"
      subtitle="Titularidad, autorizaciones y licencias"
      description="Gestión integral de derechos de autor, licencias, contratos y autorizaciones de explotación. Registro interno de obras con evidencias y hashes verificables."
      icon={Shield}
      status="DESIGNED"
      color="bg-andalus-800"
      features={[
        { name: 'Registro de obras', description: 'Identificadores y metadatos de cada obra.', status: 'DESIGNED' },
        { name: 'Titulares declarados', description: 'Registro de autores y colaboradores.', status: 'DESIGNED' },
        { name: 'Licencias', description: 'Gestión de licencias y cesiones autorizadas.', status: 'DESIGNED' },
        { name: 'Contratos', description: 'Documentación contractual versionada.', status: 'DESIGNED' },
        { name: 'Territorios y plazos', description: 'Delimitación geográfica y temporal.', status: 'DESIGNED' },
        { name: 'Evidencias', description: 'Hashes, marcas de agua y pruebas de autoría.', status: 'DESIGNED' },
      ]}
      futureCapabilities={[
        'Integración con estándares de metadatos',
        'Historial de versiones de obras',
        'Solicitudes de retirada (DMCA)',
        'Obras derivadas y titulares múltiples',
        'La plataforma no adquiere propiedad automática',
        'Distinguir obras protegidas, dominio público y contenido IA',
      ]}
    />
  );
}

export function TracePage() {
  return (
    <ModulePage
      moduleId="trace"
      title="Andalus Trace 360°"
      subtitle="Identificación, seguimiento y rendimiento verificable"
      description="Sistema de identificación y seguimiento de obras en plataformas de distribución. Distingue entre coincidencias detectadas, datos reportados, verificados y liquidados."
      icon={Eye}
      status="DESIGNED"
      color="bg-andalus-900"
      features={[
        { name: 'Fingerprinting', description: 'Identificadores audiovisuales de audio y vídeo.', status: 'DESIGNED' },
        { name: 'Coincidencias', description: 'Detección de usos en plataformas autorizadas.', status: 'DESIGNED' },
        { name: 'Informes', description: 'Datos de audiencia y reproducciones reportadas.', status: 'DESIGNED' },
        { name: 'Ingresos reportados', description: 'Liquidaciones y distribuciones entre titulares.', status: 'DESIGNED' },
        { name: 'Evidencias', description: 'Historial verificable de detecciones.', status: 'DESIGNED' },
        { name: 'Clasificación', description: 'DETECTED, REPORTED, VERIFIED, ESTIMATED, SETTLED.', status: 'DESIGNED' },
      ]}
      futureCapabilities={[
        'Conectores con plataformas de distribución',
        'Fingerprinting de audio y vídeo',
        'No se promete observar toda Internet sin acuerdos',
        'Coincidencia detectada ≠ ingreso demostrado',
        'Integración con Andalus Wallet para liquidaciones',
        'Informes auditables por el creador',
      ]}
    />
  );
}

export function WalletPage() {
  return (
    <ModulePage
      moduleId="wallet"
      title="Andalus Wallet"
      subtitle="Ganancias de creadores y operaciones financieras"
      description="Módulo de gestión de ganancias, liquidaciones y retiradas para creadores. Separación absoluta entre fondos de creadores e ingresos de la plataforma."
      icon={Wallet}
      status="DESIGNED"
      color="bg-andalus-600"
      features={[
        { name: 'Ganancias devengadas', description: 'Ingresos generados por las obras del creador.', status: 'DESIGNED' },
        { name: 'Liquidaciones', description: 'Proceso de cálculo y distribución de ganancias.', status: 'DESIGNED' },
        { name: 'Historial', description: 'Registro completo de movimientos financieros.', status: 'DESIGNED' },
        { name: 'Retiradas', description: 'Solicitudes de payout a cuentas autorizadas.', status: 'DESIGNED' },
        { name: 'Separación contable', description: 'Fondos de creadores ≠ ingresos de plataforma.', status: 'DESIGNED' },
        { name: 'Créditos de servicio', description: 'Ledger de créditos para uso en producción.', status: 'DESIGNED' },
      ]}
      futureCapabilities={[
        'Proveedor financiero autorizado para custodia',
        'Retiradas y acumulación voluntaria',
        'Reinversión en servicios con autorización expresa',
        'No se bloquean artificialmente las retiradas del creador',
        'Compatible con marcos legales de cada país',
        'Créditos promocionales no son dinero retirable',
      ]}
    />
  );
}
