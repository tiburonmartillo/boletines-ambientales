import type { Metadata } from 'next'

// Metadata específica para la página de boletines ambientales
export const metadata: Metadata = {
  title: 'Boletines Ambientales - Dashboard Interactivo | ADN-Aguascalientes',
  description: 'Explora los boletines ambientales de la Secretaría de Medio Ambiente del Estado de Aguascalientes. Dashboard interactivo con más de 1,000 proyectos y resolutivos ambientales. Visualiza tendencias temporales, filtra por municipio, giro empresarial y fecha. Datos actualizados y accesibles para la ciudadanía.',
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
    title: 'Boletines Ambientales - Dashboard Interactivo | ADN-Aguascalientes',
    description: 'Dashboard interactivo con más de 1,000 proyectos y resolutivos ambientales de Aguascalientes. Explora tendencias temporales, filtra por municipio y giro empresarial. Datos actualizados de la SSMAA.',
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
    title: 'Boletines Ambientales - Dashboard Interactivo | ADN-Aguascalientes',
    description: 'Explora más de 1,000 proyectos y resolutivos ambientales de Aguascalientes. Dashboard interactivo con filtros por municipio, giro empresarial y fecha.',
    images: ['/assets/logocompleto.png'],
    creator: '@adn_ags',
    site: '@adn_ags',
  },
  alternates: {
    canonical: 'https://adn-a.org/boletines-ambientales',
  },
}

export default function BoletinesAmbientalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
