import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dashboard de Boletines Ambientales - Aguascalientes',
  description: 'Visualización de datos de boletines ambientales publicados por la Secretaría de Medio Ambiente del Estado de Aguascalientes',
  generator: 'Next.js',
  keywords: ['medio ambiente', 'aguascalientes', 'boletines', 'proyectos ambientales', 'dashboard'],
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
