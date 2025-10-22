import type { Metadata } from 'next'

interface ResumenBoletinLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ResumenBoletinLayoutProps): Promise<Metadata> {
  const { id } = await params
  const boletinId = parseInt(id)

  return {
    title: `Resumen Boletín SSMAA #${boletinId} | ADN-Aguascalientes`,
    description: `Resumen detallado del Boletín Ambiental de la SSMAA #${boletinId}. Proyectos ingresados, resolutivos emitidos y mapas de ubicación.`,
    keywords: [
      'resumen boletín ambiental',
      'SSMAA',
      'aguascalientes',
      'proyectos ambientales',
      'resolutivos ambientales',
      'mapas ambientales'
    ],
    openGraph: {
      title: `Resumen Boletín SSMAA #${boletinId} | ADN-Aguascalientes`,
      description: `Resumen detallado del Boletín Ambiental de la SSMAA #${boletinId}. Proyectos ingresados, resolutivos emitidos y mapas de ubicación.`,
      url: `https://adn-a.org/boletines-ssmaa/resumen/${boletinId}`,
      siteName: 'ADN-Aguascalientes',
      images: [
        {
          url: '/assets/miniaturaboletines.png',
          width: 1238,
          height: 1005,
          alt: `Resumen Boletín SSMAA #${boletinId}`,
        },
      ],
      locale: 'es_MX',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Resumen Boletín SSMAA #${boletinId}`,
      description: `Resumen detallado del Boletín Ambiental de la SSMAA #${boletinId}. Proyectos ingresados, resolutivos emitidos y mapas de ubicación.`,
      images: ['/assets/miniaturaboletines.png'],
      creator: '@adn_ags',
      site: '@adn_ags',
    },
    alternates: {
      canonical: `https://adn-a.org/boletines-ssmaa/resumen/${boletinId}`,
    },
  }
}

export default function ResumenBoletinLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
