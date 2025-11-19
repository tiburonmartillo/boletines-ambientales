"use client"

import { Button } from "@/components/ui/button"
import { FileText, ArrowDown } from "lucide-react"

interface BoletinesV2HeroProps {
  onScrollToContent?: () => void
  onSubscribe?: () => void
}

export function BoletinesV2Hero({
  onScrollToContent,
  onSubscribe
}: BoletinesV2HeroProps) {
  const handleScrollToContent = () => {
    if (onScrollToContent) {
      onScrollToContent()
    } else {
      // Scroll suave al contenido principal
      const contentElement = document.getElementById('boletines-content')
      if (contentElement) {
        contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <section className="relative w-full py-12 md:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          {/* Icono */}
          <div className="rounded-full bg-primary/10 p-4">
            <FileText className="h-12 w-12 text-primary" aria-hidden="true" />
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Boletines Ambientales SSMAA
          </h1>

          {/* Descripción */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Accede a información transparente sobre los proyectos ambientales 
            en Aguascalientes. Consulta boletines oficiales, proyectos ingresados 
            y resolutivos emitidos por la Secretaría de Medio Ambiente.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              onClick={handleScrollToContent}
              className="w-full sm:w-auto"
              aria-label="Explorar boletines"
            >
              Explorar boletines
              <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
            {onSubscribe && (
              <Button
                size="lg"
                variant="outline"
                onClick={onSubscribe}
                className="w-full sm:w-auto"
                aria-label="Suscribirse para recibir actualizaciones"
              >
                Recibir actualizaciones
              </Button>
            )}
          </div>

          {/* Información adicional */}
          <p className="text-sm text-muted-foreground pt-4">
            Información oficial de{" "}
            <a
              href="https://www.aguascalientes.gob.mx/SSMAA/BoletinesSMA"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Secretaría de Medio Ambiente del Estado de Aguascalientes
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

