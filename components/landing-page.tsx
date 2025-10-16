"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ExternalLink } from 'lucide-react';
import svgPaths from '@/lib/svg-paths';
import { Navbar } from './navbar';


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
            <h1 className="font-['Poppins:Bold',_sans-serif] text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[72px] leading-[1] text-[#000000]">
              Un Ambiente<br />Sano es<br />Nuestro Derecho
            </h1>
            <p className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-[#000000]/80 leading-[1.6] max-w-xl">
              Coalición ciudadana comprometida con la defensa del medio ambiente en Aguascalientes a través de la incidencia social y política. Trabajamos por un ambiente sano, limpio y equilibrado para todas y todos.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={scrollToInitiatives}
              className="group bg-[#1E3A8A] hover:bg-[#F97316] px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300"
            >
              <span className="font-['Poppins:Bold',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white transition-colors duration-300">
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
    <section className="py-10 sm:py-16 relative bg-[#1E3A8A] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-2 relative z-10">
        <div className="bg-white rounded-3xl p-6 py-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block border-2 border-[#F97316] text-gray-500 border-2 px-4 sm:px-6 py-2 rounded-full mb-4 sm:mb-6">
                <span className="font-['Poppins:Bold',_sans-serif] text-[16px]">🐸 CAMPAÑA DESTACADA</span>
              </div>
              <h2 className="font-['Poppins:Bold',_sans-serif] text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[56px] text-[#000000] mb-4 sm:mb-6 leading-[1.1]">
                #ADNaRanita
              </h2>
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] text-[#000000]/80 leading-[1.7] mb-6 sm:mb-8">
                Únete a nuestra petición ciudadana en Change.org para la protección de las especies endémicas y ecosistemas vulnerables de Aguascalientes. Tu firma puede hacer la diferencia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://www.change.org/adn-a_ranita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#F97316] hover:bg-[#1E3A8A] text-white px-6 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                
                >
                  <span className="font-['Poppins:Bold',_sans-serif] text-[22px]">
                    Firma la Petición
                  </span>
                
                </a>
                <a 
                  href="https://www.change.org/adn-a_ranita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-2 border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white px-6 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span className="font-['Poppins:Bold',_sans-serif] text-[22px]">
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
                    <h3 className="font-['Poppins:Bold',_sans-serif] text-[18px] sm:text-[20px] lg:text-[24px] text-[#000000] mb-2">
                      Protejamos nuestra biodiversidad
                    </h3>
                    <p className="font-['Poppins:Regular',_sans-serif] text-[14px] sm:text-[16px] text-[#000000]/70">
                      Las especies endémicas de Aguascalientes están en peligro. Necesitamos tu apoyo para proteger nuestros ecosistemas únicos.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#0D5850]/10">
                    <div className="text-center">
                      <div className="font-['Poppins:Bold',_sans-serif] text-[24px] sm:text-[28px] lg:text-[32px] text-[#F97316]">19K+</div>
                      <div className="font-['Poppins:Regular',_sans-serif] text-[12px] sm:text-[14px] text-[#000000]/70">Firmas</div>
                    </div>
                    <div className="text-center">
                      <div className="font-['Poppins:Bold',_sans-serif] text-[24px] sm:text-[28px] lg:text-[32px] text-[#1E3A8A]">25K</div>
                      <div className="font-['Poppins:Regular',_sans-serif] text-[12px] sm:text-[14px] text-[#000000]/70">Meta</div>
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
        <h2 className="font-['Poppins:Bold',_sans-serif] text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[80px] text-[#000000] mb-6 sm:mb-8 lg:mb-12">
          Nosotros
        </h2>
        
        <div className="max-w-4xl">
          <p className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] text-[#000000]/80 leading-[1.7] mb-6 sm:mb-8">
            ADN-Aguascalientes es una coalición de asociaciones civiles y personas comprometidas con la defensa del derecho humano a un medio ambiente sano, limpio y equilibrado.
          </p>
          <p className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] text-[#000000]/80 leading-[1.7]">
            Trabajamos a través de la incidencia social y política para promover políticas públicas ambientales efectivas, fomentar la participación ciudadana en la toma de decisiones ambientales, y defender los ecosistemas naturales de Aguascalientes. Creemos que un medio ambiente sano es fundamental para el bienestar de las comunidades presentes y futuras.
          </p>
        </div>

        {/* Mission */}
        <div className="mt-16 border-2 border-teal-500 rounded-3xl p-8">
          <h3 className="font-['Poppins:Bold',_sans-serif] text-[20px] sm:text-[24px] lg:text-[28px] text-[#000000] mb-4 sm:mb-6">
            NUESTRA MISIÓN
          </h3>
          <div className="max-w-4xl">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-[#000000]/80 leading-[1.7]">
              Promover y defender el derecho a un medio ambiente sano mediante la articulación de esfuerzos ciudadanos, la incidencia en políticas públicas, y la generación de conciencia ambiental. Buscamos construir una sociedad informada y participativa que contribuya activamente a la protección y restauración de los recursos naturales en Aguascalientes.
            </p>
          </div>
        </div>

        {/* Our Work */}
        <div className="mt-16">
          <h3 className="font-['Poppins:Bold',_sans-serif] text-[20px] sm:text-[24px] lg:text-[28px] text-[#000000] mb-6 sm:mb-8">
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
      <h4 className="font-['Poppins:ExtraBold',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-[#000000] mb-2 sm:mb-3">
        {title}
      </h4>
      <p className="font-['Poppins:Regular',_sans-serif] text-[14px] sm:text-[16px] lg:text-[18px] text-[#000000]/70 leading-[1.6]">
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
    // {
    //   title: "Defensa del Acuífero del Valle de Aguascalientes",
    //   period: "2020 — presente",
    //   description: "Campaña permanente para la protección del acuífero sobreexplotado de Aguascalientes, promoviendo políticas de gestión sustentable del agua, oposición a concesiones irresponsables, y fomento de tecnologías de captación pluvial y tratamiento de aguas residuales."
    // },
    // {
    //   title: "Aguascalientes sin Megagranja",
    //   period: "2022 — 2024",
    //   description: "Movimiento ciudadano que logró detener el establecimiento de una megagranja porcícola que amenazaba la calidad del agua y la salud de las comunidades cercanas. A través de la movilización social y recursos legales, se consiguió la cancelación del proyecto."
    // },
    // {
    //   title: "Observatorio de Calidad del Aire",
    //   period: "2021 — presente",
    //   description: "Iniciativa de monitoreo ciudadano de la calidad del aire en Aguascalientes, utilizando sensores de bajo costo y ciencia ciudadana para generar información independiente y exigir acciones gubernamentales para reducir la contaminación atmosférica."
    // },
    // {
    //   title: "Programa Bosques Urbanos",
    //   period: "2023 — presente",
    //   description: "Proyecto de reforestación urbana y periurbana que busca aumentar la cobertura arbórea en la ciudad de Aguascalientes, mejorando la calidad del aire, creando espacios públicos verdes y fortaleciendo la conexión de la ciudadanía con la naturaleza."
    // },
    // {
    //   title: "Red de Educación Ambiental",
    //   period: "2019 — presente",
    //   description: "Red de educadores, activistas y organizaciones que promueven la educación ambiental en escuelas, colonias y espacios comunitarios, formando una ciudadanía consciente y comprometida con la sustentabilidad."
    // },
    // {
    //   title: "Campaña Aguascalientes Libre de Plásticos",
    //   period: "2021 — 2023",
    //   description: "Campaña que logró la aprobación de regulaciones municipales para reducir el uso de plásticos de un solo uso en comercios y establecimientos, promoviendo alternativas sustentables y prácticas de economía circular."
    // },
    {
      title: "Defensa de las Áreas Naturales Protegidas",
      period: "2020 — presente",
      description: "Trabajo de vigilancia y defensa de las áreas naturales protegidas de Aguascalientes, exigiendo recursos adecuados para su gestión, evitando invasiones y desarrollos inmobiliarios ilegales, y promoviendo su uso educativo y recreativo responsable."
    }
  ];

  return (
    <section id="initiatives" className="py-10 sm:py-16 lg:py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-['Poppins:Bold',_sans-serif] text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[80px] text-[#000000] mb-6 sm:mb-8 lg:mb-12">
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
        <h3 className="font-['Poppins:ExtraBold',_sans-serif] text-[18px] sm:text-[20px] lg:text-[22px] text-[#000000] mb-2">
          {title}
        </h3>
        <p className="font-['Poppins:ExtraLight',_sans-serif] text-[14px] sm:text-[16px] lg:text-[18px] text-[#1E3A8A] mb-2 sm:mb-3">
          {period}
        </p>
        <p className="font-['Poppins:Regular',_sans-serif] text-[14px] sm:text-[16px] lg:text-[18px] text-[#000000]/80 leading-[1.7]">
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
        <h2 className="font-['Poppins:Bold',_sans-serif] text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[80px] text-[#000000] mb-6 sm:mb-8 lg:mb-12">
          Logros
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
             
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F97316] rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <span className="font-['Poppins:Bold',_sans-serif] text-white text-[16px] sm:text-[18px]">{index + 1}</span>
              </div>
              <h3 className="font-['Poppins:ExtraBold',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-[#000000] mb-2">
                {achievement.title}
              </h3>
              <p className="font-['Poppins:ExtraLight',_sans-serif] text-[14px] sm:text-[16px] text-[#1E3A8A] mb-2 sm:mb-3">
                {achievement.year}
              </p>
              <p className="font-['Poppins:Regular',_sans-serif] text-[14px] sm:text-[16px] text-[#000000]/80 leading-[1.6]">
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
    // Fetch data from the same source as the dashboard
    const dataUrl = process.env.NODE_ENV === 'production' 
      ? 'https://adn-a.org/data/boletines.json'
      : '/data/boletines.json';
    
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
    <section id="dashboard" className="py-10 sm:py-16 lg:py-20 relative bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-['Poppins:Bold',_sans-serif] text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[64px] text-[#000000] mb-4 sm:mb-6">
            Boletines Ambientales
          </h2>
          <p className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-gray-500 leading-[1.7] max-w-4xl mx-auto">
            Herramienta interactiva para consultar proyectos ingresados y resolutivos emitidos por la Secretaría de Medio Ambiente del Estado de Aguascalientes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          {/* Preview Visual */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-['Poppins:Bold',_sans-serif] text-[18px] sm:text-[20px] lg:text-[24px] text-[#000000]">
                    Gráficas Interactivas
                  </h3>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[14px] sm:text-[16px] text-[#1E3A8A]">
                    Visualiza tendencias temporales y distribuciones
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-xl sm:text-2xl font-bold text-[#1E3A8A]">
                      {loading ? '...' : totalProyectos.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-[#000000]/70">Proyectos Ingresados</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-xl sm:text-2xl font-bold text-[#F97316]">
                      {loading ? '...' : totalResolutivos.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-[#000000]/70">Resolutivos Emitidos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="font-['Poppins:Bold',_sans-serif] text-[24px] sm:text-[28px] lg:text-[32px] text-[#000000] mb-4 sm:mb-6">
                Características Principales
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-[#1E3A8A] leading-[1.7] mb-6 sm:mb-8">
                Accede a información detallada sobre proyectos ambientales con herramientas avanzadas de búsqueda y análisis.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Poppins:Bold',_sans-serif] text-[16px] sm:text-[18px] text-[#000000] mb-2">
                    Filtros Avanzados
                  </h4>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[14px] sm:text-[16px] text-[#1E3A8A]">
                    Busca por municipio, giro, tipo de estudio y fechas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Poppins:Bold',_sans-serif] text-[16px] sm:text-[18px] text-[#000000] mb-2">
                    Mapas de Ubicación
                  </h4>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[14px] sm:text-[16px] text-[#1E3A8A]">
                    Visualiza la ubicación exacta de cada proyecto
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Poppins:Bold',_sans-serif] text-[16px] sm:text-[18px] text-[#000000] mb-2">
                    Consulta de Boletines
                  </h4>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[14px] sm:text-[16px] text-[#1E3A8A]">
                    Accede directamente a los documentos oficiales
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-['Poppins:Bold',_sans-serif] text-[16px] sm:text-[18px] text-[#000000] mb-2">
                    Trazabilidad Completa
                  </h4>
                  <p className="font-['Poppins:Regular',_sans-serif] text-[14px] sm:text-[16px] text-[#1E3A8A]">
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
            className="inline-flex items-center gap-3 bg-blue-600 text-white font-['Poppins:Bold',_sans-serif] text-[20px] px-8 py-4 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Explorar herramienta
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 sm:py-16 lg:py-20 relative bg-[#1E3A8A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-['Poppins:Bold',_sans-serif] text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[80px] text-white mb-6 sm:mb-8 lg:mb-12">
          Contacto
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="font-['Poppins:Bold',_sans-serif] text-[20px] sm:text-[24px] lg:text-[28px] text-[#F97316] mb-4 sm:mb-6">
                ÚNETE A NUESTRA CAUSA
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white/90 leading-[1.7] mb-6 sm:mb-8">
                Si compartes nuestra preocupación por el medio ambiente de Aguascalientes y quieres sumarte a nuestras iniciativas, ponte en contacto con nosotros. Juntos podemos construir un futuro más sustentable.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-['Poppins:Bold',_sans-serif] text-[12px] sm:text-[14px] text-white/60 mb-1">Email</p>
                  <a 
                    href="mailto:comunica@adn-a.org"
                    className="font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white hover:text-[#F97316] transition-colors duration-200"
                  >
                    comunica@adn-a.org
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316]" />
                </div>
                <div>
                  <p className="font-['Poppins:Bold',_sans-serif] text-[14px] text-white/60 mb-1">WhatsApp</p>
                  <a 
                    href="https://wa.me/524493433413"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white hover:text-[#F97316] transition-colors duration-200"
                  >
                    +52 449 343 3413
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316]" fill="none" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="currentColor"></path></svg>
                </div>
                <div>
                  <p className="font-['Poppins:Bold',_sans-serif] text-[14px] text-white/60 mb-1">Canal de WhatsApp</p>
                  <a 
                    href="https://whatsapp.com/channel/0029Vb2Z1vg6RGJ9l9v0ok2U"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white hover:text-[#F97316] transition-colors duration-200"
                  >
                    Únete al canal
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/20">
              <p className="font-['Poppins:Bold',_sans-serif] text-[14px] sm:text-[16px] text-white/80 mb-3 sm:mb-4">Síguenos en redes sociales:</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                <a 
                  href="https://instagram.com/adn.ags"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] text-white hover:text-[#F97316] transition-colors duration-200"
                >
                  Instagram: @adn.ags
                </a>
              </div>
              <div className="flex gap-6 mt-3">
                <a 
                  href="https://facebook.com/@adnags"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] text-white hover:text-[#F97316] transition-colors duration-200"
                >
                  Facebook: @adnags
                </a>
              </div>
              <div className="flex gap-6 mt-3">
                <a 
                  href="https://tiktok.com/@adn_ags"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] text-white hover:text-[#F97316] transition-colors duration-200"
                >
                  TikTok: @adn_ags
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-3xl p-6 sm:p-8 border border-white/20">
            <h4 className="font-['Poppins:Bold',_sans-serif] text-[18px] sm:text-[20px] lg:text-[24px] text-[#F97316] mb-4 sm:mb-6">
              FORMAS DE PARTICIPAR
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <span className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-white/90">
                  Asiste a nuestras reuniones y asambleas
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <span className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-white/90">
                  Participa en jornadas de reforestación y limpieza
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <span className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-white/90">
                  Comparte información sobre nuestras campañas
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <span className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-white/90">
                  Firma y difunde nuestras peticiones
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <span className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-white/90">
                  Contribuye con donaciones para nuestras iniciativas
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen text-[#000000]">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCampaignSection />
        <AboutSection />
        <InitiativesSection />
        <ImpactSection />
        <DashboardSection />
      </main>
      <Footer />
    </div>
  );
}
