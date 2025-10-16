"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ExternalLink } from 'lucide-react';
import svgPaths from '@/lib/svg-paths';

function Navigation() {
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'about', label: 'Nosotros' },
    { id: 'initiatives', label: 'Iniciativas' },
    { id: 'impact', label: 'Logros' },
    { id: 'contact', label: 'Contacto' }
  ];

  const externalNavItems = [
    { href: '/boletines-ssmaa', label: 'Boletines Ambientales' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#0D5850]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Image src="/assets/logocompleto.png" alt="ADN-Aguascalientes" width={200} height={80} />
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-['Poppins:Regular',_sans-serif] text-[16px] transition-colors duration-200 ${
                    activeSection === item.id ? 'text-[#0D5850]' : 'text-[#0D5850]/70 hover:text-[#0D5850]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {externalNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-['Poppins:Regular',_sans-serif] text-[16px] transition-colors duration-200 text-[#0D5850]/70 hover:text-[#0D5850]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <SocialIcon type="instagram" url="https://instagram.com/adn.ags" />
            <SocialIcon type="facebook" url="https://facebook.com/adnags" />
            <SocialIcon type="tiktok" url="https://tiktok.com/@adn_ags" />
            <SocialIcon type="whatsapp" url="https://whatsapp.com/channel/0029Vb2Z1vg6RGJ9l9v0ok2U" />
          </div>
        </div>
      </div>
    </nav>
  );
}

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
          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none"
        />
      );
    }
  };

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#0D5850] hover:text-[#2B8FA6] transition-colors duration-200"
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        {getIcon()}
      </svg>
    </a>
  );
}

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
            <Image src="/assets/logocompleto.png" alt="ADN-Aguascalientes" width={400} height={100} />
            <h1 className="font-['Poppins:Bold',_sans-serif] text-[56px] lg:text-[72px] leading-[1] text-[#0D5850]">
              Un Ambiente<br />Sano es<br />Nuestro Derecho
            </h1>
            <p className="font-['Poppins:Regular',_sans-serif] text-[20px] text-[#0D5850]/70 leading-[1.6] max-w-xl">
              Coalición ciudadana comprometida con la defensa del medio ambiente en Aguascalientes a través de la incidencia social y política. Trabajamos por un ambiente sano, limpio y equilibrado para todas y todos.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={scrollToInitiatives}
              className="group bg-[#0D5850] hover:bg-[#2B8FA6] px-8 py-4 rounded-full transition-all duration-300"
              style={{boxShadow: '0 10px 30px rgba(164, 165, 165, 0.3)'}}
            >
              <span className="font-['Poppins:Bold',_sans-serif] text-[20px] text-white transition-colors duration-300">
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
            className="relative w-full h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

function FeaturedCampaignSection() {
  return (
    <section className="py-16 relative bg-[#0D5850] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-white rounded-3xl p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#2B8FA6] text-white px-6 py-2 rounded-full mb-6">
                <span className="font-['Poppins:Bold',_sans-serif] text-[16px]">🐸 CAMPAÑA DESTACADA</span>
              </div>
              <h2 className="font-['Poppins:Bold',_sans-serif] text-[48px] lg:text-[56px] text-[#0D5850] mb-6 leading-[1.1]">
                #ADNaRanita
              </h2>
              <p className="font-['Poppins:Regular',_sans-serif] text-[22px] text-[#0D5850]/80 leading-[1.7] mb-8">
                Únete a nuestra petición ciudadana en Change.org para la protección de las especies endémicas y ecosistemas vulnerables de Aguascalientes. Tu firma puede hacer la diferencia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://www.change.org/adn-a_ranita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#2B8FA6] hover:bg-[#0D5850] text-white px-8 py-5 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                  style={{ boxShadow: '0 10px 30px rgba(164, 165, 165, 0.3)' }}
                >
                  <span className="font-['Poppins:Bold',_sans-serif] text-[22px]">
                    Firma la Petición
                  </span>
                  <ExternalLink className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.change.org/adn-a_ranita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-2 border-[#2B8FA6] text-[#2B8FA6] hover:bg-[#2B8FA6] hover:text-white px-8 py-5 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span className="font-['Poppins:Bold',_sans-serif] text-[22px]">
                    Comparte
                  </span>
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-[#F5F8F6] rounded-3xl p-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-[72px] mb-4">🐸</div>
                    <h3 className="font-['Poppins:Bold',_sans-serif] text-[24px] text-[#0D5850] mb-2">
                      Protejamos nuestra biodiversidad
                    </h3>
                    <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-[#0D5850]/70">
                      Las especies endémicas de Aguascalientes están en peligro. Necesitamos tu apoyo para proteger nuestros ecosistemas únicos.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#0D5850]/10">
                    <div className="text-center">
                      <div className="font-['Poppins:Bold',_sans-serif] text-[32px] text-[#2B8FA6]">19K+</div>
                      <div className="font-['Poppins:Regular',_sans-serif] text-[14px] text-[#0D5850]/70">Firmas</div>
                    </div>
                    <div className="text-center">
                      <div className="font-['Poppins:Bold',_sans-serif] text-[32px] text-[#2B8FA6]">25K</div>
                      <div className="font-['Poppins:Regular',_sans-serif] text-[14px] text-[#0D5850]/70">Meta</div>
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
    <section id="about" className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-['Poppins:Bold',_sans-serif] text-[64px] lg:text-[80px] text-[#0D5850] mb-12">
          Nosotros
        </h2>
        
        <div className="max-w-4xl">
          <p className="font-['Poppins:Regular',_sans-serif] text-[22px] text-[#0D5850]/80 leading-[1.7] mb-8">
            ADN-Aguascalientes es una coalición de asociaciones civiles y personas comprometidas con la defensa del derecho humano a un medio ambiente sano, limpio y equilibrado.
          </p>
          <p className="font-['Poppins:Regular',_sans-serif] text-[22px] text-[#0D5850]/80 leading-[1.7]">
            Trabajamos a través de la incidencia social y política para promover políticas públicas ambientales efectivas, fomentar la participación ciudadana en la toma de decisiones ambientales, y defender los ecosistemas naturales de Aguascalientes. Creemos que un medio ambiente sano es fundamental para el bienestar de las comunidades presentes y futuras.
          </p>
        </div>

        {/* Mission */}
        <div className="mt-16 bg-[#F5F8F6] rounded-3xl p-8">
          <h3 className="font-['Poppins:Bold',_sans-serif] text-[28px] text-[#0D5850] mb-6">
            NUESTRA MISIÓN
          </h3>
          <div className="max-w-4xl">
            <p className="font-['Poppins:Medium',_sans-serif] text-[20px] text-[#0D5850]/80 leading-[1.7]">
              Promover y defender el derecho a un medio ambiente sano mediante la articulación de esfuerzos ciudadanos, la incidencia en políticas públicas, y la generación de conciencia ambiental. Buscamos construir una sociedad informada y participativa que contribuya activamente a la protección y restauración de los recursos naturales en Aguascalientes.
            </p>
          </div>
        </div>

        {/* Our Work */}
        <div className="mt-16">
          <h3 className="font-['Poppins:Bold',_sans-serif] text-[28px] text-[#0D5850] mb-8">
            NUESTRO TRABAJO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WorkItem
              title="INCIDENCIA POLÍTICA"
              description="Trabajamos directamente con autoridades gubernamentales para promover leyes, reglamentos y políticas públicas que protejan el medio ambiente y garanticen la participación ciudadana en las decisiones ambientales."
              color="#0D5850"
            />
            <WorkItem
              title="EDUCACIÓN Y CONCIENCIA AMBIENTAL"
              description="Organizamos talleres, foros y campañas de comunicación para informar a la ciudadanía sobre los problemas ambientales locales y las formas de participar en su solución."
              color="#2B8FA6"
            />
            <WorkItem
              title="DEFENSA TERRITORIAL"
              description="Acompañamos a comunidades en la defensa de sus territorios frente a proyectos que amenazan los recursos naturales, promoviendo el respeto al derecho a la consulta y el consentimiento libre, previo e informado."
              color="#7DC9D1"
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
      className="bg-white rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 border border-[#0D5850]/10"
      style={{ boxShadow: '0 10px 30px rgba(164, 165, 165, 0.3)' }}
    >
      <div className="w-12 h-1 mb-4 rounded-full" style={{ backgroundColor: color }} />
      <h4 className="font-['Poppins:ExtraBold',_sans-serif] text-[20px] text-[#0D5850] mb-3">
        {title}
      </h4>
      <p className="font-['Poppins:Regular',_sans-serif] text-[18px] text-[#0D5850]/70 leading-[1.6]">
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
      title: "Defensa del Acuífero del Valle de Aguascalientes",
      period: "2020 — presente",
      description: "Campaña permanente para la protección del acuífero sobreexplotado de Aguascalientes, promoviendo políticas de gestión sustentable del agua, oposición a concesiones irresponsables, y fomento de tecnologías de captación pluvial y tratamiento de aguas residuales."
    },
    {
      title: "Aguascalientes sin Megagranja",
      period: "2022 — 2024",
      description: "Movimiento ciudadano que logró detener el establecimiento de una megagranja porcícola que amenazaba la calidad del agua y la salud de las comunidades cercanas. A través de la movilización social y recursos legales, se consiguió la cancelación del proyecto."
    },
    {
      title: "Observatorio de Calidad del Aire",
      period: "2021 — presente",
      description: "Iniciativa de monitoreo ciudadano de la calidad del aire en Aguascalientes, utilizando sensores de bajo costo y ciencia ciudadana para generar información independiente y exigir acciones gubernamentales para reducir la contaminación atmosférica."
    },
    {
      title: "Programa Bosques Urbanos",
      period: "2023 — presente",
      description: "Proyecto de reforestación urbana y periurbana que busca aumentar la cobertura arbórea en la ciudad de Aguascalientes, mejorando la calidad del aire, creando espacios públicos verdes y fortaleciendo la conexión de la ciudadanía con la naturaleza."
    },
    {
      title: "Red de Educación Ambiental",
      period: "2019 — presente",
      description: "Red de educadores, activistas y organizaciones que promueven la educación ambiental en escuelas, colonias y espacios comunitarios, formando una ciudadanía consciente y comprometida con la sustentabilidad."
    },
    {
      title: "Campaña Aguascalientes Libre de Plásticos",
      period: "2021 — 2023",
      description: "Campaña que logró la aprobación de regulaciones municipales para reducir el uso de plásticos de un solo uso en comercios y establecimientos, promoviendo alternativas sustentables y prácticas de economía circular."
    },
    {
      title: "Defensa de las Áreas Naturales Protegidas",
      period: "2020 — presente",
      description: "Trabajo de vigilancia y defensa de las áreas naturales protegidas de Aguascalientes, exigiendo recursos adecuados para su gestión, evitando invasiones y desarrollos inmobiliarios ilegales, y promoviendo su uso educativo y recreativo responsable."
    }
  ];

  return (
    <section id="initiatives" className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-['Poppins:Bold',_sans-serif] text-[64px] lg:text-[80px] text-[#0D5850] mb-12">
          Iniciativas
        </h2>
        
        <div className="space-y-8">
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
      className="max-w-4xl relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-[#0D5850]/10 mx-auto"
      style={{ boxShadow: '0 10px 30px rgba(164, 165, 165, 0.3)' }}
    >
      <div className="relative">
        <div className="absolute left-[-40px] top-[8px] w-[16px] h-[16px] bg-[#2B8FA6] rounded-full" />
        <h3 className="font-['Poppins:ExtraBold',_sans-serif] text-[22px] text-[#0D5850] mb-2">
          {title}
        </h3>
        <p className="font-['Poppins:ExtraLight',_sans-serif] text-[18px] text-[#2B8FA6] mb-3">
          {period}
        </p>
        <p className="font-['Poppins:Regular',_sans-serif] text-[18px] text-[#0D5850]/80 leading-[1.7]">
          {description}
        </p>
      </div>
    </div>
  );
}

function ImpactSection() {
  const achievements = [
    {
      title: "Cancelación de Megagranja Porcícola",
      year: "2024",
      description: "Victoria ciudadana que evitó la contaminación del acuífero y protegió la salud de comunidades locales"
    },
    {
      title: "Reglamento Municipal de Plásticos",
      year: "2023",
      description: "Aprobación de regulación para reducir plásticos de un solo uso en todo el municipio"
    },
    {
      title: "15,000 Árboles Plantados",
      year: "2023 — 2024",
      description: "Reforestación urbana y periurbana a través del Programa Bosques Urbanos"
    },
    {
      title: "Red de 50+ Sensores de Calidad del Aire",
      year: "2022",
      description: "Sistema ciudadano de monitoreo ambiental independiente en toda la zona metropolitana"
    },
    {
      title: "Participación en Ley General de Aguas",
      year: "2021 — presente",
      description: "Incidencia en el proceso legislativo federal para garantizar el derecho humano al agua"
    },
    {
      title: "Alianza con 30+ Organizaciones",
      year: "2020",
      description: "Consolidación de ADN-Aguascalientes como coalición de organizaciones ambientalistas"
    }
  ];

  return (
    <section id="impact" className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-['Poppins:Bold',_sans-serif] text-[64px] lg:text-[80px] text-[#0D5850] mb-12">
          Logros
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-[#0D5850]/5 to-[#7DC9D1]/5 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
              style={{ boxShadow: '0 10px 30px rgba(164, 165, 165, 0.3)' }}
            >
              <div className="w-12 h-12 bg-[#2B8FA6] rounded-full flex items-center justify-center mb-4">
                <span className="font-['Poppins:Bold',_sans-serif] text-white text-[18px]">{index + 1}</span>
              </div>
              <h3 className="font-['Poppins:ExtraBold',_sans-serif] text-[20px] text-[#0D5850] mb-2">
                {achievement.title}
              </h3>
              <p className="font-['Poppins:ExtraLight',_sans-serif] text-[16px] text-[#2B8FA6] mb-3">
                {achievement.year}
              </p>
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-[#0D5850]/80 leading-[1.6]">
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
  return (
    <section id="dashboard" className="py-20 relative bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-['Poppins:Bold',_sans-serif] text-[48px] lg:text-[64px] text-[#0D5850] mb-6">
            Dashboard de Boletines Ambientales
          </h2>
          <p className="font-['Poppins:Regular',_sans-serif] text-[20px] text-[#2B8FA6] leading-[1.7] max-w-4xl mx-auto">
            Herramienta interactiva para consultar proyectos ingresados y resolutivos emitidos por la Secretaría de Medio Ambiente del Estado de Aguascalientes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Preview Visual */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-['Poppins:Bold',_sans-serif] text-[24px] text-[#0D5850]">
                    Gráficas Interactivas
                  </h3>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-[#2B8FA6]">
                    Visualiza tendencias temporales y distribuciones
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-gray-600">Proyectos Ingresados</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-pink-600">892</div>
                    <div className="text-sm text-gray-600">Resolutivos Emitidos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="space-y-8">
            <div>
              <h3 className="font-['Poppins:Bold',_sans-serif] text-[32px] text-[#0D5850] mb-6">
                Características Principales
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[18px] text-[#2B8FA6] leading-[1.7] mb-8">
                Accede a información detallada sobre proyectos ambientales con herramientas avanzadas de búsqueda y análisis.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#2B8FA6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Poppins:Bold',_sans-serif] text-[18px] text-[#0D5850] mb-2">
                    Filtros Avanzados
                  </h4>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-[#2B8FA6]">
                    Busca por municipio, giro, tipo de estudio y fechas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#2B8FA6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Poppins:Bold',_sans-serif] text-[18px] text-[#0D5850] mb-2">
                    Mapas de Ubicación
                  </h4>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-[#2B8FA6]">
                    Visualiza la ubicación exacta de cada proyecto
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#2B8FA6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Poppins:Bold',_sans-serif] text-[18px] text-[#0D5850] mb-2">
                    Consulta de Boletines
                  </h4>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-[#2B8FA6]">
                    Accede directamente a los documentos oficiales
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#2B8FA6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Poppins:Bold',_sans-serif] text-[18px] text-[#0D5850] mb-2">
                    Trazabilidad Completa
                  </h4>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-[#2B8FA6]">
                    Relación entre proyectos ingresados y resolutivos emitidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/boletines-ssmaa"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#2B8FA6] to-[#0D5850] text-white font-['Poppins:Bold',_sans-serif] text-[20px] px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Explorar Dashboard
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-20 relative bg-[#0D5850]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-['Poppins:Bold',_sans-serif] text-[64px] lg:text-[80px] text-white mb-12">
          Contacto
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="font-['Poppins:Bold',_sans-serif] text-[28px] text-[#F5A962] mb-6">
                ÚNETE A NUESTRA CAUSA
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[20px] text-white/90 leading-[1.7] mb-8">
                Si compartes nuestra preocupación por el medio ambiente de Aguascalientes y quieres sumarte a nuestras iniciativas, ponte en contacto con nosotros. Juntos podemos construir un futuro más sustentable.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#7DC9D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-['Poppins:Bold',_sans-serif] text-[14px] text-white/60 mb-1">Email</p>
                  <a 
                    href="mailto:comunica@adn-a.org"
                    className="font-['Poppins:Medium',_sans-serif] text-[20px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                  >
                    comunica@adn-a.org
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#7DC9D1]" />
                </div>
                <div>
                  <p className="font-['Poppins:Bold',_sans-serif] text-[14px] text-white/60 mb-1">WhatsApp</p>
                  <a 
                    href="https://wa.me/524493433413"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Poppins:Medium',_sans-serif] text-[20px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                  >
                    +52 449 343 3413
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#7DC9D1]" />
                </div>
                <div>
                  <p className="font-['Poppins:Bold',_sans-serif] text-[14px] text-white/60 mb-1">Canal de WhatsApp</p>
                  <a 
                    href="https://whatsapp.com/channel/0029Vb2Z1vg6RGJ9l9v0ok2U"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Poppins:Medium',_sans-serif] text-[20px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                  >
                    Únete al canal
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/20">
              <p className="font-['Poppins:Bold',_sans-serif] text-[16px] text-white/80 mb-4">Síguenos en redes sociales:</p>
              <div className="flex gap-6">
                <a 
                  href="https://instagram.com/adn.ags"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[18px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                >
                  Instagram: @adn.ags
                </a>
              </div>
              <div className="flex gap-6 mt-3">
                <a 
                  href="https://facebook.com/adnags"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[18px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                >
                  Facebook: adnags
                </a>
              </div>
              <div className="flex gap-6 mt-3">
                <a 
                  href="https://tiktok.com/@adn_ags"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[18px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                >
                  TikTok: @adn_ags
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-3xl p-8 border border-white/20">
            <h4 className="font-['Poppins:Bold',_sans-serif] text-[24px] text-[#7DC9D1] mb-6">
              FORMAS DE PARTICIPAR
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#2B8FA6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <span className="font-['Poppins:Regular',_sans-serif] text-[18px] text-white/90">
                  Asiste a nuestras reuniones y asambleas
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#2B8FA6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <span className="font-['Poppins:Regular',_sans-serif] text-[18px] text-white/90">
                  Participa en jornadas de reforestación y limpieza
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#2B8FA6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <span className="font-['Poppins:Regular',_sans-serif] text-[18px] text-white/90">
                  Comparte información sobre nuestras campañas
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#2B8FA6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <span className="font-['Poppins:Regular',_sans-serif] text-[18px] text-white/90">
                  Firma y difunde nuestras peticiones
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#2B8FA6] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <span className="font-['Poppins:Regular',_sans-serif] text-[18px] text-white/90">
                  Contribuye con donaciones para nuestras iniciativas
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen text-[#0D5850]">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedCampaignSection />
        <AboutSection />
        <InitiativesSection />
        <ImpactSection />
        <DashboardSection />
        <ContactSection />
      </main>
    </div>
  );
}
