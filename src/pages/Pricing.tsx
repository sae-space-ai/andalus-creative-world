import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-andalus-900 dark:text-white mb-4">
          Precios y créditos
        </h1>
        <p className="text-lg text-andalus-600 dark:text-andalus-300 max-w-2xl mx-auto">
          Sistema de créditos para servicios de producción. Compra créditos y utilízalos 
          en las herramientas de creación audiovisual.
        </p>
      </div>

      {/* Status Banner */}
      <div className="card bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm mb-1">
              Sistema de pagos no activado
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Los precios mostrados son orientativos. Stripe TEST está en estado CONFIGURATION_REQUIRED. 
              No se pueden realizar compras hasta que se configuren las credenciales de pago.
            </p>
          </div>
        </div>
      </div>

      {/* Credit Packs */}
      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        <PricingCard
          title="Inicio"
          price="20"
          credits="200 créditos"
          features={['Acceso completo a proyectos', 'Subida de PDF', 'Procesamiento básico']}
          popular={false}
        />
        <PricingCard
          title="Creador"
          price="50"
          credits="600 créditos"
          features={['Todo lo del plan Inicio', '20% bonificación incluida', 'Prioridad en procesamiento', 'Soporte preferente']}
          popular={true}
        />
        <PricingCard
          title="Estudio"
          price="150"
          credits="2.000 créditos"
          features={['Todo lo del plan Creador', '33% bonificación incluida', 'Procesamiento avanzado', 'API de integración']}
          popular={false}
        />
      </div>

      {/* How Credits Work */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-andalus-900 dark:text-white mb-4">¿Cómo funcionan los créditos?</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <CreditInfo title="Créditos de compra" description="Se obtienen al realizar un pago. Son la base del sistema." />
            <CreditInfo title="Bonificación promocional" description="Créditos adicionales por primera compra. No son dinero retirable." />
            <CreditInfo title="Consumo" description="Cada servicio consume créditos según su coste definido." />
          </div>
          <div className="space-y-3">
            <CreditInfo title="Sin caducidad" description="Los créditos comprados no caducan mientras la cuenta esté activa." />
            <CreditInfo title="Ledger seguro" description="Cada movimiento se registra con idempotencia y trazabilidad." />
            <CreditInfo title="Reembolsos" description="Política de reembolso transparente según tipo de operación." />
          </div>
        </div>
      </div>

      {/* First Purchase Promotion */}
      <div className="card bg-andalus-50 dark:bg-andalus-800/50 border-andalus-200 dark:border-andalus-700 mb-8">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-andalus-600 dark:text-andalus-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-andalus-900 dark:text-white text-sm mb-1">
              Promoción de primera compra
            </h3>
            <p className="text-sm text-andalus-600 dark:text-andalus-300">
              Primera compra elegible: 20 EUR. Valor promocional adicional: equivalente a 20 EUR en créditos de servicio. 
              La campaña está desactivada por defecto y requiere configuración y aprobación.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-andalus-500 dark:text-andalus-400 mb-4">
          ¿Listo para comenzar? Crea tu cuenta gratuita y explora la plataforma.
        </p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2">
          Crear cuenta gratuita
        </Link>
      </div>
    </div>
  );
}

function PricingCard({ title, price, credits, features, popular }: {
  title: string;
  price: string;
  credits: string;
  features: string[];
  popular: boolean;
}) {
  return (
    <div className={`card relative ${popular ? 'border-andalus-500 dark:border-andalus-400 ring-2 ring-andalus-500/20' : ''}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-andalus-600 text-white text-xs font-bold rounded-full">
          Popular
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-andalus-900 dark:text-white mb-1">{title}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-andalus-900 dark:text-white">{price}€</span>
        </div>
        <p className="text-sm text-andalus-500 mt-1">{credits}</p>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-andalus-600 dark:text-andalus-300">
            <CheckCircle2 size={16} className="text-andalus-500 mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <button disabled className="w-full py-2.5 rounded-lg bg-andalus-200 dark:bg-andalus-700 text-andalus-500 dark:text-andalus-400 text-sm font-medium cursor-not-allowed">
        Próximamente
      </button>
    </div>
  );
}

function CreditInfo({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 size={16} className="text-andalus-500 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-andalus-900 dark:text-white">{title}</p>
        <p className="text-xs text-andalus-500">{description}</p>
      </div>
    </div>
  );
}
