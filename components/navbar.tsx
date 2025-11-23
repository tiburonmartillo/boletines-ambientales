"use client"

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SocialIcon({ type, url }: { type: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp'; url: string }) {
  const getIcon = () => {
    if (type === 'instagram') {
      return (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </>
      );
    } else if (type === 'facebook') {
      return (
        <path
          d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none"
        />
      );
    } else if (type === 'tiktok') {
      return (
        <path
          d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none"
        />
      );
    } else {
      return (
        <path
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
          fill="currentColor"
        />
      );
    }
  };

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#000000] hover:text-[var(--color-accent)] transition-colors duration-200"
    >
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24">
        {getIcon()}
      </svg>
    </a>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // All navigation items
  const navItems = useMemo(() => [
    { id: 'home', label: 'Inicio', href: '/', type: 'page' },
    // Secciones de landing
    { id: 'about', label: 'Nosotros', href: '/#about', type: 'section', group: 'secciones' },
    { id: 'initiatives', label: 'Iniciativas', href: '/#initiatives', type: 'section', group: 'secciones' },
    { id: 'impact', label: 'Logros', href: '/#impact', type: 'section', group: 'secciones' },
    { id: 'contact', label: 'Contacto', href: '/#contact', type: 'section', group: 'secciones' },
    { id: 'dashboard', label: 'Suscripción', href: '/#dashboard', type: 'section', group: 'secciones' },
    { id: 'boletines', label: 'Boletines Ambientales', href: '/boletines-ssmaa', type: 'page', group: 'herramientas' },
    { id: 'gacetas', label: 'Gacetas SEMARNAT', href: '/gacetas-semarnat', type: 'page', group: 'herramientas' },
    // { id: 'email-generator', label: 'Generador Email', href: '/email-generator', type: 'page', group: 'herramientas' }
  ], []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleNavClick = (item: any) => {
    if (item.type === 'section') {
      // Si estamos en la landing page, hacer scroll
      if (pathname === '/') {
        scrollToSection(item.id);
        // Actualizar URL con hash para que sea compartible
        window.history.pushState(null, '', `/#${item.id}`);
      } else {
        // Si estamos en otra página, ir a la landing page con hash
        window.location.href = item.href;
      }
    } else {
      // Para páginas, solo navegar
      setActiveSection(item.id);
    }
  };

  // Scroll to section on mount or hash change
  useEffect(() => {
    if (pathname !== '/') return;

    const scrollToHash = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (hash) {
        // Try multiple times in case element isn't rendered yet
        const attemptScroll = (attempts = 0) => {
          const element = document.getElementById(hash);
          if (element) {
            const offset = 80; // Navbar height offset
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: attempts === 0 ? 'auto' : 'smooth' // Instant on first load, smooth on hash change
            });
            setActiveSection(hash);
          } else if (attempts < 10) {
            // Retry up to 10 times (1 second max wait)
            setTimeout(() => attemptScroll(attempts + 1), 100);
          }
        };
        
        // Start scrolling attempt
        setTimeout(() => attemptScroll(), 50);
      }
    };

    // Scroll on initial load or when navigating to landing with hash
    scrollToHash();

    // Listen for hash changes
    const handleHashChange = () => {
      setTimeout(() => scrollToHash(), 50);
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const sections = navItems.filter(item => item.type === 'section').map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      let currentActive = 'home';
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            currentActive = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, navItems]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--border-soft)] shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-4" ref={menuRef}>
          <div className="flex justify-between items-center">
            <div className="flex items-center flex-shrink-0 h-12 sm:h-16 md:h-20">
              <Link href="/" className="flex items-center h-full" onClick={() => setMobileOpen(false)}>
                {/* Logo PNG en pantallas chicas */}
                <img 
                  src="/assets/Logo-ADN-A-corto.png" 
                  alt="ADN-Aguascalientes"
                  className="block md:hidden h-full w-auto flex-shrink-0 max-h-[48px]"
                />
                {/* Logo completo en pantallas grandes */}
                <img 
                  src="/assets/Logo-ADN-A-completo.png" 
                  alt="ADN-Aguascalientes" 
                  className="hidden md:block h-full w-auto max-h-[64px]"
                />
              </Link>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Botón "Recibir Boletín" - oculto en móvil, visible en desktop */}
              <a
                href="https://adnags.notion.site/29c2b8101e5c80fdbd89f8c03728e80d"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden md:inline">Recibir Boletín</span>
                <span className="md:hidden">Boletín</span>
              </a>
              
              {/* Iconos sociales - ocultos en móvil */}
              <div className="hidden sm:flex items-center gap-2 sm:gap-3 md:gap-4">
                <SocialIcon type="instagram" url="https://instagram.com/adn.ags" />
                <SocialIcon type="facebook" url="https://facebook.com/@adnags" />
                <SocialIcon type="tiktok" url="https://tiktok.com/@adn_ags" />
                <SocialIcon type="whatsapp" url="https://whatsapp.com/channel/0029Vb2Z1vg6RGJ9l9v0ok2U" />
              </div>

              {/* Botón hamburguesa con animación */}
              <button
                className="relative inline-flex items-center justify-center p-2 rounded-md text-[#000000] hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 flex-shrink-0 touch-manipulation"
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(v => !v)}
              >
                <span className="sr-only">{mobileOpen ? "Cerrar menú" : "Abrir menú"}</span>
                <div className="w-5 h-5 relative">
                  <span
                    className={`absolute top-0 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ${
                      mobileOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                  />
                  <span
                    className={`absolute top-2 left-0 w-5 h-0.5 bg-current transition-all duration-300 ${
                      mobileOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`absolute top-4 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ${
                      mobileOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
          
          {/* Menú móvil con animación */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              mobileOpen ? 'max-h-[calc(100vh-80px)] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="mt-3 pt-3 border-t border-gray-200 pb-4">
              <div className="space-y-1">
                {/* Inicio */}
                <Link 
                  href="/" 
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    pathname === '/' 
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium' 
                      : 'text-[#000000]/80 hover:bg-gray-50'
                  }`} 
                  onClick={() => setMobileOpen(false)}
                >
                  Inicio
                </Link>
                
                {/* Secciones */}
                <div className="pt-2">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Secciones
                  </div>
                  <div className="space-y-0.5">
                    {navItems.filter(i => i.group === 'secciones').map(item => (
                      <button
                        key={item.id}
                        onClick={() => { 
                          handleNavClick(item); 
                          setMobileOpen(false); 
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-[#000000]/80 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Herramientas */}
                <div className="pt-2">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Herramientas
                  </div>
                  <div className="space-y-0.5">
                    {navItems.filter(i => i.group === 'herramientas').map(item => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2.5 rounded-lg text-[#000000]/80 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Botón "Recibir Boletín" en móvil */}
                <div className="pt-3 border-t border-gray-200">
                  <a
                    href="https://adnags.notion.site/29c2b8101e5c80fdbd89f8c03728e80d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-white px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Recibir Boletín</span>
                  </a>
                </div>
                
                {/* Iconos sociales en móvil */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-4 px-3">
                    <SocialIcon type="instagram" url="https://instagram.com/adn.ags" />
                    <SocialIcon type="facebook" url="https://facebook.com/@adnags" />
                    <SocialIcon type="tiktok" url="https://tiktok.com/@adn_ags" />
                    <SocialIcon type="whatsapp" url="https://whatsapp.com/channel/0029Vb2Z1vg6RGJ9l9v0ok2U" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Overlay para cerrar menú al hacer clic fuera */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}