import type { Metadata } from 'next'

// Metadata específica para la página de boletines ambientales
export const metadata: Metadata = {
  title: 'Boletines Ambientales - Dashboard Interactivo | ADN-Aguascalientes',
  description: '🌱 Descubre el estado ambiental de Aguascalientes con nuestro dashboard interactivo. Más de 1,000 proyectos y resolutivos ambientales de la SSMAA. Visualiza tendencias, filtra por municipio y tipo de proyecto. Transparencia ambiental para todos los ciudadanos.',
  keywords: [
    'boletines ambientales',
    'aguascalientes',
    'secretaría medio ambiente',
    'proyectos ambientales',
    'resolutivos ambientales',
    'dashboard ambiental',
    'transparencia ambiental',
    'participación ciudadana',
    'monitoreo ambiental',
    'evaluación impacto ambiental',
    'SSMAA',
    'gobierno abierto',
    'datos ambientales',
    'visualización datos'
  ],
  openGraph: {
    title: '🌱 Boletines Ambientales - Dashboard Interactivo | ADN-Aguascalientes',
    description: 'Explora más de 1,000 proyectos ambientales de Aguascalientes en tiempo real. Dashboard interactivo con filtros por municipio, giro empresarial y fecha. Datos oficiales de la SSMAA para promover la transparencia ambiental.',
    url: 'https://adn-a.org/boletines-ambientales',
    siteName: 'ADN-Aguascalientes',
    images: [
      {
        url: '/assets/logocompleto.png',
        width: 1200,
        height: 630,
        alt: 'Dashboard de Boletines Ambientales - ADN Aguascalientes',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🌱 Boletines Ambientales - Dashboard Interactivo | ADN-Aguascalientes',
    description: 'Más de 1,000 proyectos ambientales de Aguascalientes en un dashboard interactivo. Filtra por municipio, giro empresarial y fecha. Datos oficiales de la SSMAA para transparencia ambiental.',
    images: ['/assets/logocompleto.png'],
    creator: '@adn_ags',
    site: '@adn_ags',
  },
  alternates: {
    canonical: 'https://adn-a.org/boletines-ambientales',
  },
  other: {
    'whatsapp:description': '🌱 Descubre más de 1,000 proyectos ambientales de Aguascalientes. Dashboard interactivo con datos oficiales de la SSMAA. Filtra por municipio, giro empresarial y fecha. Transparencia ambiental para todos.',
    'whatsapp:title': 'Boletines Ambientales - Dashboard Interactivo',
  },
}

export default function BoletinesAmbientalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
