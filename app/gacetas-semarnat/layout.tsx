import type { Metadata } from 'next'

// Metadata específica para la página de gacetas SEMARNAT
export const metadata: Metadata = {
  title: 'Gacetas Ecológicas SEMARNAT: Monitorea Proyectos Ambientales Federales | ADN-Aguascalientes',
  description: '🎯 Descubre cómo los ciudadanos pueden supervisar proyectos ambientales federales en Aguascalientes. Dashboard interactivo con datos oficiales de las Gacetas Ecológicas de SEMARNAT. Reduce tiempos de búsqueda, filtra por municipio y tipo de proyecto. Transparencia gubernamental al alcance de todos.',
  keywords: [
    'dashboard ambiental federal',
    'gacetas ecológicas semarnat',
    'monitoreo proyectos ambientales federales',
    'transparencia gubernamental federal',
    'supervisión ciudadana',
    'datos ambientales oficiales semarnat',
    'gacetas semarnat',
    'gobierno abierto',
    'participación ciudadana',
    'control ambiental federal',
    'evaluación impacto ambiental federal',
    'SEMARNAT dashboard',
    'visualización datos ambientales federales',
    'filtros ambientales federales'
  ],
  openGraph: {
    title: 'Gacetas ecológicas SEMARNAT: Monitorea Proyectos Ambientales Federales | ADN-Aguascalientes',
    description: 'Supervisa proyectos ambientales federales de Aguascalientes con datos oficiales de las Gacetas Ecológicas de SEMARNAT. Dashboard interactivo que reduce tiempos de búsqueda. Filtra por municipio, tipo de proyecto y fecha. Transparencia gubernamental para todos los ciudadanos.',
    url: 'https://adn-a.org/gacetas-semarnat',
    siteName: 'ADN-Aguascalientes',
    images: [
      {
        url: 'https://adn-a.org/assets/miniaturaboletines.png',
        width: 1238,
        height: 1005,
      alt: 'Gacetas ecológicas SEMARNAT - Monitoreo Ambiental Federal',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gacetas ecológicas SEMARNAT: Monitorea Proyectos Ambientales Federales',
    description: '🎯 Supervisa proyectos ambientales federales con datos oficiales de SEMARNAT. Filtra por municipio y fecha. Transparencia gubernamental.',
    images: ['https://adn-a.org/assets/miniaturaboletines.png'],
    creator: '@adn_ags',
    site: '@adn_ags',
  },
  alternates: {
    canonical: 'https://adn-a.org/gacetas-semarnat',
  },
  other: {
    'whatsapp:description': 'Gacetas ecológicas SEMARNAT: Monitorea proyectos ambientales federales en tiempo real. Filtra por municipio, giro empresarial y fecha. Transparencia gubernamental.',
    'whatsapp:title': 'Gacetas ecológicas SEMARNAT - Monitoreo Ambiental Federal',
  },
}

export default function GacetasSEMARNATLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

