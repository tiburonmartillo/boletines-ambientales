import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import '../styles/leaflet.css'

export const metadata: Metadata = {
  title: 'ADN-Aguascalientes - Un Ambiente Sano es Nuestro Derecho',
  description: 'Coalición ciudadana comprometida con la defensa del medio ambiente en Aguascalientes. Dashboard de boletines ambientales y información sobre nuestras iniciativas.',
  generator: 'Next.js',
  keywords: ['ADN-Aguascalientes', 'medio ambiente', 'aguascalientes', 'boletines', 'proyectos ambientales', 'dashboard', 'coalición ciudadana'],
  icons: {
    icon: '/assets/ico.png',
    shortcut: '/assets/ico.png',
    apple: '/assets/ico.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
