"use client"

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
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
      className="text-[#000000] hover:text-[#F97316] transition-colors duration-200"
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

  // All navigation items
  const navItems = useMemo(() => [
    { id: 'home', label: 'Inicio', href: '/', type: 'page' },
    // Secciones de landing
    { id: 'about', label: 'Nosotros', href: '/#about', type: 'section', group: 'secciones' },
    { id: 'initiatives', label: 'Iniciativas', href: '/#initiatives', type: 'section', group: 'secciones' },
    { id: 'impact', label: 'Logros', href: '/#impact', type: 'section', group: 'secciones' },
    { id: 'contact', label: 'Contacto', href: '/#contact', type: 'section', group: 'secciones' },
    { id: 'subscription', label: 'Suscríbete', href: '/#subscription', type: 'section', group: 'secciones' },
    // Herramientas
    { id: 'boletines', label: 'Dashboard', href: '/boletines-ssmaa', type: 'page', group: 'herramientas' },
    { id: 'email-generator', label: 'Generador Email', href: '/email-generator', type: 'page', group: 'herramientas' },
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
      } else {
        // Si estamos en otra página, ir a la landing page y luego hacer scroll
        window.location.href = item.href;
      }
    } else {
      // Para páginas, solo navegar
      setActiveSection(item.id);
    }
  };

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1E3A8A]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex items-center">
              <Image 
                src="/assets/logocompleto.png" 
                alt="ADN-Aguascalientes" 
                width={300} 
                height={64} 
                className="sm:w-[250px]"
              />
            </Link>
            {/* Desktop nav (lg and up) */}
            <div className="hidden lg:flex items-center gap-4 lg:gap-6">
              {navItems.map((item) => {
                const isActive = item.type === 'page' 
                  ? pathname === item.href 
                  : activeSection === item.id;
                
                return item.type === 'section' ? (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`text-[14px] lg:text-[16px] transition-colors duration-200 ${
                      isActive ? 'text-[#1E3A8A] underline' : 'text-[#000000]/70 hover:text-[#1E3A8A]'
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`text-[14px] lg:text-[16px] transition-colors duration-200 ${
                      isActive ? 'text-[#1E3A8A] underline' : 'text-[#000000]/70 hover:text-[#1E3A8A]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            {/* Desktop grouped dropdowns (md to lg) */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              {/* Inicio directo */}
              <Link href="/" className={`text-[14px] transition-colors ${pathname === '/' ? 'text-[#1E3A8A] underline' : 'text-[#000000]/70 hover:text-[#1E3A8A]'}`}>Inicio</Link>
              {/* Menú Secciones */}
              <div className="relative group">
                <button className="text-[14px] text-[#000000]/70 hover:text-[#1E3A8A]">Secciones ▾</button>
                <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded-md shadow-lg min-w-[220px] p-2 z-50">
                  {navItems.filter(i => i.group === 'secciones').map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className="block w-full text-left px-3 py-2 text-[14px] hover:bg-gray-50 rounded-md text-[#000000]/80 hover:text-[#1E3A8A]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Menú Herramientas */}
              <div className="relative group">
                <button className="text-[14px] text-[#000000]/70 hover:text-[#1E3A8A]">Herramientas ▾</button>
                <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded-md shadow-lg min-w-[220px] p-2 z-50">
                  {navItems.filter(i => i.group === 'herramientas').map(item => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="block px-3 py-2 text-[14px] hover:bg-gray-50 rounded-md text-[#000000]/80 hover:text-[#1E3A8A]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="https://whatsapp.com/channel/0029Vb2Z1vg6RGJ9l9v0ok2U"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#1E3A8A] text-white px-3 sm:px-4 py-2 rounded-full transition-all duration-300 font-medium text-[12px] sm:text-[14px]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="hidden lg:inline">Recibir Boletín</span>
              <span className="lg:hidden">Boletín</span>
            </a>
            <SocialIcon type="instagram" url="https://instagram.com/adn.ags" />
            <SocialIcon type="facebook" url="https://facebook.com/@adnags" />
            <SocialIcon type="tiktok" url="https://tiktok.com/@adn_ags" />
            <SocialIcon type="whatsapp" url="https://whatsapp.com/channel/0029Vb2Z1vg6RGJ9l9v0ok2U" />

            {/* Hamburger for md and below */}
            <button
              className="md:inline-flex lg:hidden ml-2 p-2 rounded-md border text-[#000000] hover:bg-gray-50"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen(v => !v)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile/Tablet dropdown (md and below) */}
        {mobileOpen && (
          <div className="md:block lg:hidden mt-3 border-t pt-3">
            <div className="grid gap-2">
              <Link href="/" className={`block px-2 py-2 rounded hover:bg-gray-50 ${pathname === '/' ? 'text-[#1E3A8A] underline' : 'text-[#000000]/80'}`} onClick={() => setMobileOpen(false)}>Inicio</Link>
              <div>
                <div className="px-2 py-2 text-xs uppercase tracking-wide text-gray-500">Secciones</div>
                <div className="grid">
                  {navItems.filter(i => i.group === 'secciones').map(item => (
                    <button
                      key={item.id}
                      onClick={() => { handleNavClick(item); setMobileOpen(false); }}
                      className="text-left px-3 py-2 rounded hover:bg-gray-50 text-[#000000]/80"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="px-2 py-2 text-xs uppercase tracking-wide text-gray-500">Herramientas</div>
                <div className="grid">
                  {navItems.filter(i => i.group === 'herramientas').map(item => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 rounded hover:bg-gray-50 text-[#000000]/80"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}