import type { Metadata } from 'next'

// Metadata específica para la página de boletines SSMAA
export const metadata: Metadata = {
  title: '🚀 Dashboard SSMAA: Monitorea Proyectos Ambientales en Tiempo Real | ADN-Aguascalientes',
  description: '🎯 Descubre cómo los ciudadanos pueden supervisar proyectos ambientales en Aguascalientes. Dashboard interactivo con datos oficiales de la SSMAA. Reduce tiempos de búsqueda del 90%, filtra por municipio y tipo de proyecto. Transparencia gubernamental al alcance de todos.',
  keywords: [
    'dashboard ambiental aguascalientes',
    'monitoreo proyectos ambientales',
    'transparencia gubernamental',
    'supervisión ciudadana',
    'datos ambientales oficiales',
    'boletines SSMAA',
    'gobierno abierto',
    'participación ciudadana',
    'control ambiental',
    'evaluación impacto ambiental',
    'SSMAA dashboard',
    'visualización datos ambientales',
    'filtros ambientales'
  ],
  openGraph: {
    title: 'Dashboard SSMAA: Monitorea Proyectos Ambientales en Tiempo Real | ADN-Aguascalientes',
    description: '🎯 Supervisa proyectos ambientales de Aguascalientes con datos oficiales de la SSMAA. Dashboard interactivo que reduce tiempos de búsqueda del 90%. Filtra por municipio, giro empresarial y fecha. Transparencia gubernamental para todos los ciudadanos.',
    url: 'https://adn-a.org/boletines-ssmaa',
    siteName: 'ADN-Aguascalientes',
    images: [
      {
        url: 'https://adn-a.org/assets/logocompleto.png',
        width: 1200,
        height: 630,
        alt: 'Dashboard SSMAA - Monitoreo Ambiental en Tiempo Real',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard SSMAA: Monitorea Proyectos Ambientales en Tiempo Real',
    description: '🎯 Supervisa proyectos ambientales con datos oficiales de la SSMAA. Reduce tiempos de búsqueda del 90%. Filtra por municipio y fecha. Transparencia gubernamental.',
    images: ['https://adn-a.org/assets/logocompleto.png'],
    creator: '@adn_ags',
    site: '@adn_ags',
  },
  alternates: {
    canonical: 'https://adn-a.org/boletines-ssmaa',
  },
  other: {
    'whatsapp:description': '🚀 Dashboard SSMAA: Monitorea proyectos ambientales en tiempo real. Reduce tiempos de búsqueda del 90%. Filtra por municipio, giro empresarial y fecha. Transparencia gubernamental.',
    'whatsapp:title': 'Dashboard SSMAA - Monitoreo Ambiental',
  },
}

export default function BoletinesSSMAALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
