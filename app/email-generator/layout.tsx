import { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Generador de Email | Boletines Ambientales ADN-A',
  description: 'Genera plantillas HTML para correo electrónico de boletines ambientales de SSMAA',
}

export default function EmailGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
