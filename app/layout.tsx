import type { Metadata } from 'next'
import { Kumbh_Sans } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import '../styles/leaflet.css'

const kumbhSans = Kumbh_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['100','200','300','400','500','600','700','800','900']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://adn-a.org'),
  title: 'ADN-Aguascalientes - Un Ambiente Sano es Nuestro Derecho',
  description: 'Coalición ciudadana que defiende el medio ambiente en Aguascalientes. Incidencia política, educación ambiental, defensa territorial y monitoreo ciudadano. Conoce nuestras campañas, logros e iniciativas por un ambiente sano, limpio y equilibrado.',
  generator: 'Next.js',
  keywords: [
    'ADN-Aguascalientes', 
    'medio ambiente', 
    'aguascalientes', 
    'coalición ciudadana', 
    'incidencia política', 
    'defensa ambiental', 
    'educación ambiental', 
    'monitoreo ciudadano', 
    'boletines ambientales', 
    'proyectos ambientales', 
    'dashboard', 
    'sustentabilidad',
    'derecho humano al ambiente',
    'participación ciudadana',
    'políticas públicas ambientales'
  ],
  authors: [{ name: 'ADN-Aguascalientes' }],
  creator: 'ADN-Aguascalientes',
  publisher: 'ADN-Aguascalientes',
  robots: 'index, follow',
  openGraph: {
    title: 'ADN-Aguascalientes - Un Ambiente Sano es Nuestro Derecho',
    description: 'Coalición ciudadana que defiende el medio ambiente en Aguascalientes. Incidencia política, educación ambiental, defensa territorial y monitoreo ciudadano.',
    url: 'https://adn-a.org',
    siteName: 'ADN-Aguascalientes',
    images: [
      {
        url: '/assets/logocompleto.png',
        width: 800,
        height: 600,
        alt: 'ADN-Aguascalientes - Un Ambiente Sano es Nuestro Derecho',
      },
      {
        url: '/assets/manifestacion_ranita.jpeg',
        width: 1200,
        height: 630,
        alt: 'Manifestación por la ranita - ADN Aguascalientes',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ADN-Aguascalientes - Un Ambiente Sano es Nuestro Derecho',
    description: 'Coalición ciudadana que defiende el medio ambiente en Aguascalientes. Incidencia política, educación ambiental y monitoreo ciudadano.',
    images: ['/assets/manifestacion_ranita.jpeg'],
    creator: '@adn_ags',
    site: '@adn_ags',
  },
  icons: {
    icon: '/assets/ico.png',
    shortcut: '/assets/ico.png',
    apple: '/assets/ico.png',
  },
  alternates: {
    canonical: 'https://adn-a.org',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${kumbhSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
