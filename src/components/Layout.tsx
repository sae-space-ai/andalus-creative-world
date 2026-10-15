import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, X, Sun, Moon, LogOut, User, ChevronDown,
  Film, Clapperboard, Users, Trophy, Shield, Eye, Wallet,
  LayoutDashboard, FolderOpen, Settings, CreditCard
} from 'lucide-react';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-andalus-900/95 backdrop-blur-md border-b border-andalus-100 dark:border-andalus-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-andalus-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AC</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-andalus-900 dark:text-white text-lg">Andalus Creative World</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/projects" active={location.pathname.startsWith('/projects')}>Proyectos</NavLink>
            <NavDropdown label="Módulos" items={[
              { to: '/cinema', label: 'Cinema', icon: Film },
              { to: '/cinema-plus', label: 'Cinema+', icon: Clapperboard },
              { to: '/community', label: 'Community', icon: Users },
              { to: '/festivals', label: 'Festivals', icon: Trophy },
              { to: '/rights', label: 'Rights', icon: Shield },
              { to: '/trace', label: 'Trace 360°', icon: Eye },
              { to: '/wallet', label: 'Wallet', icon: Wallet },
            ]} />
            <NavLink to="/pricing" active={location.pathname === '/pricing'}>Precios</NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-andalus-100 dark:hover:bg-andalus-800 transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={18} className="text-gold-400" /> : <Moon size={18} className="text-andalus-700" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-andalus-100 dark:hover:bg-andalus-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-andalus-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.displayName?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-andalus-900 dark:text-white max-w-[120px] truncate">
                    {user?.displayName}
                  </span>
                  <ChevronDown size={14} className="text-andalus-500" />
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-andalus-800 rounded-xl shadow-xl border border-andalus-100 dark:border-andalus-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-andalus-100 dark:border-andalus-700">
                      <p className="text-sm font-medium text-andalus-900 dark:text-white">{user?.displayName}</p>
                      <p className="text-xs text-andalus-500">{user?.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-andalus-700 dark:text-andalus-200 hover:bg-andalus-50 dark:hover:bg-andalus-700">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/projects" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-andalus-700 dark:text-andalus-200 hover:bg-andalus-50 dark:hover:bg-andalus-700">
                      <FolderOpen size={16} /> Mis Proyectos
                    </Link>
                    <Link to="/account" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-andalus-700 dark:text-andalus-200 hover:bg-andalus-50 dark:hover:bg-andalus-700">
                      <User size={16} /> Mi Cuenta
                    </Link>
                    <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-andalus-700 dark:text-andalus-200 hover:bg-andalus-50 dark:hover:bg-andalus-700">
                      <Settings size={16} /> Configuración
                    </Link>
                    <div className="border-t border-andalus-100 dark:border-andalus-700 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
                        <LogOut size={16} /> Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-andalus-700 dark:text-andalus-200 hover:text-andalus-900 dark:hover:text-white transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-andalus-100 dark:hover:bg-andalus-800"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-andalus-100 dark:border-andalus-700 bg-white dark:bg-andalus-900">
          <div className="px-4 py-4 space-y-2">
            {!isAuthenticated && (
              <div className="flex gap-2 pb-3 border-b border-andalus-100 dark:border-andalus-700">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm font-medium text-andalus-700 dark:text-andalus-200 border border-andalus-200 dark:border-andalus-600 rounded-lg">
                  Iniciar sesión
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center btn-primary text-sm py-2">
                  Registrarse
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <>
                <MobileNavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileNavLink>
                <MobileNavLink to="/projects" onClick={() => setMobileOpen(false)}>Proyectos</MobileNavLink>
                <MobileNavLink to="/account" onClick={() => setMobileOpen(false)}>Mi Cuenta</MobileNavLink>
              </>
            )}
            <div className="pt-2 border-t border-andalus-100 dark:border-andalus-700">
              <p className="px-3 py-1 text-xs font-semibold text-andalus-400 uppercase tracking-wider">Módulos</p>
              <MobileNavLink to="/cinema" onClick={() => setMobileOpen(false)}>🎬 Cinema</MobileNavLink>
              <MobileNavLink to="/cinema-plus" onClick={() => setMobileOpen(false)}>🎥 Cinema+</MobileNavLink>
              <MobileNavLink to="/community" onClick={() => setMobileOpen(false)}>👥 Community</MobileNavLink>
              <MobileNavLink to="/festivals" onClick={() => setMobileOpen(false)}>🏆 Festivals</MobileNavLink>
              <MobileNavLink to="/rights" onClick={() => setMobileOpen(false)}>🛡️ Rights</MobileNavLink>
              <MobileNavLink to="/trace" onClick={() => setMobileOpen(false)}>🔍 Trace 360°</MobileNavLink>
              <MobileNavLink to="/wallet" onClick={() => setMobileOpen(false)}>💰 Wallet</MobileNavLink>
            </div>
            <MobileNavLink to="/pricing" onClick={() => setMobileOpen(false)}>Precios</MobileNavLink>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, active, children }: { to: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-andalus-100 dark:bg-andalus-800 text-andalus-900 dark:text-white'
          : 'text-andalus-600 dark:text-andalus-300 hover:bg-andalus-50 dark:hover:bg-andalus-800 hover:text-andalus-900 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 rounded-lg text-sm font-medium text-andalus-700 dark:text-andalus-200 hover:bg-andalus-50 dark:hover:bg-andalus-800"
    >
      {children}
    </Link>
  );
}

function NavDropdown({ label, items }: { label: string; items: Array<{ to: string; label: string; icon: any }> }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-andalus-600 dark:text-andalus-300 hover:bg-andalus-50 dark:hover:bg-andalus-800 transition-colors"
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-52 bg-white dark:bg-andalus-800 rounded-xl shadow-xl border border-andalus-100 dark:border-andalus-700 py-2 z-50">
          {items.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-andalus-700 dark:text-andalus-200 hover:bg-andalus-50 dark:hover:bg-andalus-700"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-andalus-900 dark:bg-andalus-900 text-andalus-200 border-t border-andalus-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-andalus-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="font-bold text-white">Andalus Creative World</span>
            </div>
            <p className="text-sm text-andalus-400">
              Plataforma creativa y audiovisual de AL-ANDALUS AI.
            </p>
            <p className="text-xs text-andalus-500 mt-2">
              INTELLIGENCE · ENGINEERING · EUROPE
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cinema" className="hover:text-white transition-colors">Cinema</Link></li>
              <li><Link to="/cinema-plus" className="hover:text-white transition-colors">Cinema+</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link to="/festivals" className="hover:text-white transition-colors">Festivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Gestión</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/rights" className="hover:text-white transition-colors">Rights</Link></li>
              <li><Link to="/trace" className="hover:text-white transition-colors">Trace 360°</Link></li>
              <li><Link to="/wallet" className="hover:text-white transition-colors">Wallet</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Precios</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-andalus-400 cursor-not-allowed">Privacidad</span></li>
              <li><span className="text-andalus-400 cursor-not-allowed">Términos</span></li>
              <li><span className="text-andalus-400 cursor-not-allowed">Cookies</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-andalus-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-andalus-500">
            © {new Date().getFullYear()} AL-ANDALUS AI. Todos los derechos reservados.
          </p>
          <p className="text-xs text-andalus-500">
            FASE 00 — Fundación Integral del Producto
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-andalus-900">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
