"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Navbar } from './navbar';
import { Footer } from './footer';


function HeroSection() {
  const scrollToInitiatives = () => {
    const element = document.getElementById('initiatives');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white">

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
        {/* Left content */}
        <div className="space-y-8">
          <div className="space-y-6">
          
            <h1 className="font-bold text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[72px] leading-[1] text-gray-700">
              Un Ambiente<br />Sano es<br />Nuestro Derecho
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-gray-700/80 leading-[1.6] max-w-xl">
              Coalición ciudadana comprometida con la defensa del medio ambiente en Aguascalientes a través de la incidencia social y política. Trabajamos por un ambiente sano, limpio y equilibrado para todas y todos.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={scrollToInitiatives}
              className="group bg-[#1E3A8A] hover:bg-[#F97316] px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300"
            >
              <span className="font-bold text-[16px] sm:text-[18px] lg:text-[20px] text-white transition-colors duration-300">
                Conoce Nuestras Iniciativas
              </span>
            </button>
          </div>
        </div>

        {/* Right content - Image */}
        <div className="relative">
          <Image
            src="/assets/manifestacion_ranita.jpeg"
            alt="Manifestación por la ranita - ADN Aguascalientes"
            width={600}
            height={600}
            className="relative w-full h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}

function FeaturedCampaignSection() {
  return (
    <section className="py-10 sm:py-16 relative bg-[#86CDE3] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-2 relative z-10">
        <div className="bg-white rounded-3xl p-6 py-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block border-2 border-[#F97316] text-gray-500 border-2 px-4 sm:px-6 py-2 rounded-full mb-4 sm:mb-6">
                <span className="font-bold text-[16px]">🐸 CAMPAÑA DESTACADA</span>
              </div>
              <h2 className="font-bold text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[56px] text-gray-700 mb-4 sm:mb-6 leading-[1.1]">
                #ADNaRanita
              </h2>
              <p className="text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] text-gray-700/80 leading-[1.7] mb-6 sm:mb-8">
                Únete a nuestra petición ciudadana en Change.org para la protección de las especies endémicas y ecosistemas vulnerables de Aguascalientes. Tu firma puede hacer la diferencia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://www.change.org/adn-a_ranita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#F97316] hover:bg-[#1E3A8A] text-white px-6 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                
                >
                  <span className="font-bold text-lg">
                    Firma la Petición
                  </span>
                
                </a>
                <a 
                  href="https://www.change.org/adn-a_ranita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-2 border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white px-6 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span className="font-bold text-lg">
                    Comparte
                  </span>
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-[#F5F8F6] rounded-3xl p-2">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-[72px] mb-4">🐸</div>
                    <h3 className="font-bold text-[18px] sm:text-[20px] lg:text-[24px] text-gray-700 mb-2">
                      Protejamos nuestra biodiversidad
                    </h3>
                    <p className="text-[14px] sm:text-[16px] text-gray-700/70">
                      Las especies endémicas de Aguascalientes están en peligro. Necesitamos tu apoyo para proteger nuestros ecosistemas únicos.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#0D5850]/10">
                    <div className="text-center">
                      <div className="font-bold text-[24px] sm:text-[28px] lg:text-[32px] text-[#F97316]">19K+</div>
                      <div className="text-[12px] sm:text-[14px] text-gray-700/70">Firmas</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[24px] sm:text-[28px] lg:text-[32px] text-[#1E3A8A]">25K</div>
                      <div className="text-[12px] sm:text-[14px] text-gray-700/70">Meta</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-10 sm:py-16 lg:py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-bold text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[80px] text-gray-700 mb-6 sm:mb-8 lg:mb-12">
          Nosotros
        </h2>
        
        <div className="max-w-4xl">
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] text-gray-700/80 leading-[1.7] mb-6 sm:mb-8">
            ADN-Aguascalientes es una coalición de asociaciones civiles y personas comprometidas con la defensa del derecho humano a un medio ambiente sano, limpio y equilibrado.
          </p>
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] text-gray-700/80 leading-[1.7]">
            Trabajamos a través de la incidencia social y política para promover políticas públicas ambientales efectivas, fomentar la participación ciudadana en la toma de decisiones ambientales, y defender los ecosistemas naturales de Aguascalientes. Creemos que un medio ambiente sano es fundamental para el bienestar de las comunidades presentes y futuras.
          </p>
        </div>

        {/* Mission */}
        <div className="mt-16 border-2 border-teal-500 rounded-3xl p-8">
          <h3 className="font-bold text-[20px] sm:text-[24px] lg:text-[28px] text-gray-700 mb-4 sm:mb-6">
            NUESTRA MISIÓN
          </h3>
          <div className="max-w-4xl">
            <p className="font-medium text-[16px] sm:text-[18px] lg:text-[20px] text-gray-700/80 leading-[1.7]">
              Promover y defender el derecho a un medio ambiente sano mediante la articulación de esfuerzos ciudadanos, la incidencia en políticas públicas, y la generación de conciencia ambiental. Buscamos construir una sociedad informada y participativa que contribuya activamente a la protección y restauración de los recursos naturales en Aguascalientes.
            </p>
          </div>
        </div>

        {/* Our Work */}
        <div className="mt-16">
          <h3 className="font-bold text-[20px] sm:text-[24px] lg:text-[28px] text-gray-700 mb-6 sm:mb-8">
            NUESTRO TRABAJO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WorkItem
              title="INCIDENCIA POLÍTICA"
              description="Trabajamos directamente con autoridades gubernamentales para promover leyes, reglamentos y políticas públicas que protejan el medio ambiente y garanticen la participación ciudadana en las decisiones ambientales."
              color="#1E3A8A"
            />
            <WorkItem
              title="EDUCACIÓN Y CONCIENCIA AMBIENTAL"
              description="Organizamos talleres, foros y campañas de comunicación para informar a la ciudadanía sobre los problemas ambientales locales y las formas de participar en su solución."
              color="#F97316"
            />
            <WorkItem
              title="DEFENSA TERRITORIAL"
              description="Acompañamos a comunidades en la defensa de sus territorios frente a proyectos que amenazan los recursos naturales, promoviendo el respeto al derecho a la consulta y el consentimiento libre, previo e informado."
              color="#3B82F6"
            />
            <WorkItem
              title="MONITOREO Y VIGILANCIA"
              description="Realizamos seguimiento a proyectos y obras que pueden tener impacto ambiental, exigiendo transparencia y el cumplimiento de las normativas ambientales vigentes."
              color="#B8D77E"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkItem({ title, description, color }: { title: string; description: string; color: string }) {
  return (
    <div 
      className="bg-white rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 border border-[#1E3A8A]/10"
    >
      <div className="w-12 h-1 mb-4 rounded-full" style={{ backgroundColor: color }} />
  <h4 className="font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-gray-700 mb-2 sm:mb-3">
        {title}
      </h4>
      <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-700/70 leading-[1.6]">
        {description}
      </p>
    </div>
  );
}

function InitiativesSection() {
  const initiatives = [
    {
      title: "Amparo contra el Nuevo POEL",
      period: "2024 — presente",
      description: "Recurso legal contra el Plan de Ordenamiento Ecológico del Municipio de Aguascalientes por no garantizar la protección adecuada del medio ambiente y no cumplir con los estándares de participación ciudadana en su elaboración."
    },
    {
      title: "Amparo por Incendios",
      period: "2024 — presente",
      description: "Acción legal contra el municipio por su falta de prevención de incendios forestales y por no investigar a los posibles responsables, principalmente empresas inmobiliarias que se benefician del cambio de uso de suelo tras los incendios."
    },
    {
      title: "Amparo La Pona",
      period: "2024 — presente",
      description: "Recurso de amparo por la falta de protección al Área Natural Protegida Municipal La Pona, exigiendo que las autoridades cumplan con su responsabilidad de preservar este importante ecosistema de Aguascalientes."
    },
    {
      title: "Defensa de las Áreas Naturales Protegidas",
      period: "2020 — presente",
      description: "Trabajo de vigilancia y defensa de las áreas naturales protegidas de Aguascalientes, exigiendo recursos adecuados para su gestión, evitando invasiones y desarrollos inmobiliarios ilegales, y promoviendo su uso educativo y recreativo responsable."
    }
  ];

  return (
    <section id="initiatives" className="py-10 sm:py-16 lg:py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-bold text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[80px] text-gray-700 mb-6 sm:mb-8 lg:mb-12">
          Iniciativas
        </h2>
        
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {initiatives.map((initiative, index) => (
            <InitiativeItem
              key={index}
              title={initiative.title}
              period={initiative.period}
              description={initiative.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function InitiativeItem({ title, period, description }: { title: string; period: string; description: string }) {
  return (
    <div 
      className="max-w-4xl relative bg-white rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 mx-auto"
    >
      <div className="relative">
        <div className="absolute left-[-30px] sm:left-[-40px] top-[8px] w-[12px] h-[12px] sm:w-[16px] sm:h-[16px] bg-[#F97316] rounded-full" />
        <h3 className="font-extrabold text-[18px] sm:text-[20px] lg:text-[22px] text-gray-700 mb-2">
          {title}
        </h3>
        <p className="font-extralight text-[14px] sm:text-[16px] lg:text-[18px] text-[#1E3A8A] mb-2 sm:mb-3">
          {period}
        </p>
        <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-700/80 leading-[1.7]">
          {description}
        </p>
      </div>
    </div>
  );
}

function ImpactSection() {
  const achievements = [
    {
      title: "Amparo contra el Nuevo POEL",
      year: "2024",
      description: "Recurso legal contra el Plan de Ordenamiento Ecológico del Municipio de Aguascalientes por no garantizar la protección adecuada del medio ambiente y no cumplir con los estándares de participación ciudadana en su elaboración."
    },
    {
      title: "Amparo por Incendios",
      year: "2024",
      description: "Acción legal contra el municipio por su falta de prevención de incendios forestales y por no investigar a los posibles responsables, principalmente empresas inmobiliarias que se benefician del cambio de uso de suelo tras los incendios."
    },
    {
      title: "Alianza con 30+ Organizaciones",
      year: "2024",
      description: "Consolidación de ADN-Aguascalientes como coalición de organizaciones ambientalistas"
    }
  ];

  return (
    <section id="impact" className="py-10 sm:py-16 lg:py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-bold text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[80px] text-gray-700 mb-6 sm:mb-8 lg:mb-12">
          Logros
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
             
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F97316] rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <span className="font-bold text-white text-[16px] sm:text-[18px]">{index + 1}</span>
              </div>
              <h3 className="font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-gray-700 mb-2">
                {achievement.title}
              </h3>
              <p className="font-extralight text-[14px] sm:text-[16px] text-[#1E3A8A] mb-2 sm:mb-3">
                {achievement.year}
              </p>
              <p className="text-[14px] sm:text-[16px] text-gray-700/80 leading-[1.6]">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the same source as the dashboard with cache busting
    const timestamp = new Date().getTime();
    const dataUrl = process.env.NODE_ENV === 'production' 
      ? `https://adn-a.org/data/boletines.json?v=${timestamp}`
      : `/data/boletines.json?v=${timestamp}`;
    
    fetch(dataUrl)
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, []);

  // Calculate totals from the data
  const totalProyectos = data ? data.boletines.reduce((sum: number, boletin: any) => sum + boletin.cantidad_ingresados, 0) : 1247;
  const totalResolutivos = data ? data.boletines.reduce((sum: number, boletin: any) => sum + boletin.cantidad_resolutivos, 0) : 892;

  return (
    <section id="dashboard" className="py-20 sm:py-28 lg:py-32 relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary)]/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Content */}
          <div className="space-y-8 lg:space-y-10">
            <div className="space-y-6">
              <h2 className="font-bold text-[40px] sm:text-[48px] lg:text-[56px] xl:text-[64px] leading-tight text-white">
                Transparencia Ambiental
                <span className="block text-[var(--color-accent)] mt-2">al Alcance</span>
              </h2>
              <p className="text-[18px] sm:text-[20px] lg:text-[22px] text-white/90 leading-relaxed max-w-lg">
                Accede a información pública sobre proyectos ambientales en Aguascalientes. Visualiza, analiza y consulta datos oficiales de manera sencilla.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <div className="text-[48px] sm:text-[56px] lg:text-[64px] font-bold text-[var(--color-accent)]">
                  {loading ? '...' : totalProyectos.toLocaleString()}
                </div>
                <div className="text-[14px] sm:text-[16px] text-white/80">Proyectos Registrados</div>
              </div>
              <div className="space-y-2">
                <div className="text-[48px] sm:text-[56px] lg:text-[64px] font-bold text-[var(--brand-blue)]">
                  {loading ? '...' : totalResolutivos.toLocaleString()}
                </div>
                <div className="text-[14px] sm:text-[16px] text-white/80">Resolutivos Emitidos</div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/boletines-ssmaa"
                className="inline-flex items-center gap-3 bg-white text-[var(--color-primary)] font-bold text-[18px] px-8 py-4 rounded-full hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Explorar Dashboard
              </Link>
            </div>

            {/* Mini suscripción integrada */}
            <div className="mt-6 bg-white rounded-2xl p-5 sm:p-6 border border-[var(--border)]/80 shadow-lg">
              <h3 className="font-bold text-[18px] sm:text-[20px] text-[var(--color-primary)] text-center mb-2">
                ¿Quieres recibir el resumen semanal del boletín?
              </h3>
              <p className="text-[14px] sm:text-[16px] text-gray-700/80 text-center">
                Suscríbete gratis y recibe en tu correo los proyectos ingresados y los resolutivos emitidos, una vez por semana.
              </p>
              <div className="mt-4 text-center">
                <a
                  href="https://www.notion.so/adnags/29c2b8101e5c80fdbd89f8c03728e80d"
                  className="inline-block px-6 py-3 rounded-full font-bold text-[16px] bg-[var(--color-accent)] text-white hover:bg-[var(--color-primary)] transition-colors"
                >
                  Suscribirme al resumen semanal
                </a>
              </div>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Humans illustration */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20">
                <img 
                  src="https://blush.design/illustration/s/ZnojT4R8e3IrXUxi?c=Hair_0~fecb51-0.3~4b69fd_Skin_0~d96e05-0.3~dcad7f" 
                  alt="Personas analizando datos ambientales"
                  className="w-full h-auto max-w-md mx-auto opacity-90"
                  onError={(e) => {
                    // Fallback: ilustración SVG inline simple
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent && !parent.querySelector('.fallback-illustration')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'fallback-illustration flex items-center justify-center h-64';
                      fallback.innerHTML = `
                        <svg class="w-64 h-64 text-white/40" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="200" cy="120" r="30" fill="currentColor"/>
                          <path d="M120 250 Q120 220 200 220 T280 250" stroke="currentColor" stroke-width="15" fill="none"/>
                          <circle cx="140" cy="320" r="25" fill="currentColor" opacity="0.7"/>
                          <circle cx="200" cy="330" r="25" fill="currentColor" opacity="0.8"/>
                          <circle cx="260" cy="320" r="25" fill="currentColor" opacity="0.7"/>
                          <rect x="100" y="80" width="200" height="140" rx="10" fill="currentColor" opacity="0.2"/>
                          <path d="M150 140 L250 140 M150 180 L250 180 M150 220 L250 220" stroke="currentColor" stroke-width="8" opacity="0.5"/>
                        </svg>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-[var(--color-accent)] text-white rounded-2xl p-4 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform">
                <div className="text-sm font-medium">100% Gratis</div>
                <div className="text-xs opacity-90">Acceso público</div>
              </div>
            </div>
          </div>

        </div>

        {/* Minimal features */}
        <div className="mt-20 lg:mt-24 pt-12 border-t border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="text-[14px] text-white/90">Búsqueda Inteligente</div>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--brand-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-[14px] text-white/90">Visualización Clara</div>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--brand-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div className="text-[14px] text-white/90">Mapas Interactivos</div>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-[14px] text-white/90">Descarga de Datos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Reemplazado por componente dedicado en components/footer.tsx

function SubscriptionSection() {
  return (
    <section id="subscription" className="py-10 sm:py-16 lg:py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-200">
        <h2 className="font-bold text-[28px] sm:text-[32px] lg:text-[40px] text-gray-700 text-center mb-3">
            ¿Quieres recibir el resumen semanal del boletín?
          </h2>
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-gray-700/80 text-center max-w-3xl mx-auto">
            Suscríbete gratis y recibe en tu correo los proyectos ingresados y los resolutivos emitidos, una vez por semana.
          </p>
          <div className="mt-6 text-center">
            <a
              href="https://www.notion.so/adnags/29c2b8101e5c80fdbd89f8c03728e80d"
              className="inline-block w-full sm:w-auto px-8 py-4 rounded-full font-bold text-[18px] text-gray-700 bg-blue-100 hover:bg-blue-700 hover:text-white border border-black transition-colors"
            >
              Suscribirme al resumen semanal
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen text-gray-700">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCampaignSection />
        <AboutSection />
        <InitiativesSection />
        <ImpactSection />
        <DashboardSection />
        <SubscriptionSection />
      </main>
      <Footer />
    </div>
  );
}
