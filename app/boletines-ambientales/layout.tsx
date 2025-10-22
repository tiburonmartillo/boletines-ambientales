import type { Metadata } from 'next'

// Metadata específica para la página de boletines ambientales
export const metadata: Metadata = {
  title: '🎯 Dashboard Ambiental: Analiza 1,000+ Proyectos en Segundos | ADN-Aguascalientes',
  description: '⚡ Transforma la forma de consultar datos ambientales en Aguascalientes. Dashboard interactivo que acelera la búsqueda de proyectos ambientales en un 95%. Filtra por municipio, giro empresarial y fecha. Datos oficiales de la SSMAA para ciudadanos, empresas y autoridades.',
  keywords: [
    'dashboard ambiental aguascalientes',
    'análisis proyectos ambientales',
    'consulta rápida datos ambientales',
    'filtros ambientales avanzados',
    'transparencia ambiental',
    'datos oficiales SSMAA',
    'gobierno abierto',
    'participación ciudadana',
    'monitoreo ambiental',
    'evaluación impacto ambiental',
    'visualización datos ambientales',
    'herramientas ambientales',
    'acceso rápido información ambiental'
  ],
  openGraph: {
    title: '🎯 Dashboard Ambiental: Analiza 1,000+ Proyectos en Segundos | ADN-Aguascalientes',
    description: '⚡ Acelera la consulta de datos ambientales en Aguascalientes. Dashboard interactivo que reduce tiempos de búsqueda en un 95%. Filtra por municipio, giro empresarial y fecha. Datos oficiales de la SSMAA para todos.',
    url: 'https://adn-a.org/boletines-ambientales',
    siteName: 'ADN-Aguascalientes',
    images: [
      {
        url: '/assets/logocompleto.png',
        width: 1200,
        height: 630,
        alt: 'Dashboard Ambiental - Análisis Rápido de Proyectos',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎯 Dashboard Ambiental: Analiza 1,000+ Proyectos en Segundos',
    description: '⚡ Acelera la consulta de datos ambientales en Aguascalientes. Reduce tiempos de búsqueda en un 95%. Filtra por municipio y fecha. Datos oficiales de la SSMAA.',
    images: ['/assets/logocompleto.png'],
    creator: '@adn_ags',
    site: '@adn_ags',
  },
  alternates: {
    canonical: 'https://adn-a.org/boletines-ambientales',
  },
  other: {
    'whatsapp:description': '🎯 Dashboard Ambiental: Analiza más de 1,000 proyectos ambientales en segundos. Reduce tiempos de búsqueda en un 95%. Filtra por municipio, giro empresarial y fecha. Datos oficiales de la SSMAA.',
    'whatsapp:title': 'Dashboard Ambiental - Análisis Rápido',
  },
}

export default function BoletinesAmbientalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
