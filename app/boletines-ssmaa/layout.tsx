import type { Metadata } from 'next'

// Metadata específica para la página de boletines SSMAA
export const metadata: Metadata = {
  title: 'Boletines SSMAA - Dashboard Ambiental | ADN-Aguascalientes',
  description: '🌱 Accede a los boletines oficiales de la Secretaría de Medio Ambiente de Aguascalientes (SSMAA). Dashboard interactivo con más de 1,000 proyectos y resolutivos ambientales. Visualiza tendencias, filtra por municipio y tipo de proyecto. Transparencia gubernamental en tiempo real.',
  keywords: [
    'boletines SSMAA',
    'secretaría medio ambiente aguascalientes',
    'boletines ambientales oficiales',
    'proyectos ambientales aguascalientes',
    'resolutivos ambientales',
    'dashboard gubernamental',
    'transparencia ambiental',
    'gobierno abierto aguascalientes',
    'monitoreo ambiental',
    'evaluación impacto ambiental',
    'SSMAA',
    'datos ambientales oficiales',
    'visualización datos gubernamentales'
  ],
  openGraph: {
    title: '🌱 Boletines SSMAA - Dashboard Ambiental | ADN-Aguascalientes',
    description: 'Accede a los boletines oficiales de la SSMAA de Aguascalientes. Dashboard interactivo con más de 1,000 proyectos ambientales. Filtra por municipio, giro empresarial y fecha. Datos oficiales para transparencia gubernamental.',
    url: 'https://adn-a.org/boletines-ssmaa',
    siteName: 'ADN-Aguascalientes',
    images: [
      {
        url: '/assets/logocompleto.png',
        width: 1200,
        height: 630,
        alt: 'Dashboard de Boletines SSMAA - ADN Aguascalientes',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🌱 Boletines SSMAA - Dashboard Ambiental | ADN-Aguascalientes',
    description: 'Boletines oficiales de la SSMAA de Aguascalientes en dashboard interactivo. Más de 1,000 proyectos ambientales con filtros por municipio y fecha. Transparencia gubernamental.',
    images: ['/assets/logocompleto.png'],
    creator: '@adn_ags',
    site: '@adn_ags',
  },
  alternates: {
    canonical: 'https://adn-a.org/boletines-ssmaa',
  },
  other: {
    'whatsapp:description': '🌱 Boletines oficiales de la SSMAA de Aguascalientes. Dashboard interactivo con más de 1,000 proyectos ambientales. Filtra por municipio, giro empresarial y fecha. Transparencia gubernamental.',
    'whatsapp:title': 'Boletines SSMAA - Dashboard Ambiental',
  },
}

export default function BoletinesSSMAALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
