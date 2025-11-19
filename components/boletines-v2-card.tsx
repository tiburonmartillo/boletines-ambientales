"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  MapPin,
  Calendar,
  FileText,
  Download,
  History,
  Sparkles,
} from "lucide-react"
import type { Boletin } from "@/lib/types"
import {
  formatearFecha,
  esBoletinNuevo,
  calcularEstadoCumplimiento,
  obtenerColorEstado,
  obtenerTextoEstado,
  obtenerIconoEstado,
  formatearContador,
} from "@/lib/boletines-v2-utils"
import * as Icons from "lucide-react"

interface BoletinesV2CardProps {
  boletin: Boletin
  onVerHistorial?: (boletin: Boletin) => void
  onVerResumen?: (boletin: Boletin) => void
}

export function BoletinesV2Card({
  boletin,
  onVerHistorial,
  onVerResumen,
}: BoletinesV2CardProps) {
  const esNuevo = esBoletinNuevo(boletin.fecha_publicacion)
  const estado = calcularEstadoCumplimiento(boletin)
  const fechaFormateada = formatearFecha(boletin.fecha_publicacion)
  const colorEstado = obtenerColorEstado(estado)
  const textoEstado = obtenerTextoEstado(estado)
  const nombreIcono = obtenerIconoEstado(estado)
  const IconoEstado = (Icons as any)[nombreIcono] || Icons.HelpCircle

  // Obtener tipos de estudio únicos
  const tiposEstudio = Array.from(
    new Set([
      ...(boletin.proyectos_ingresados || []).map((p) => p.tipo_estudio),
      ...(boletin.resolutivos_emitidos || []).map((r) => r.tipo_estudio),
    ])
  ).filter(Boolean)

  // Obtener municipios únicos
  const municipios = Array.from(
    new Set([
      ...(boletin.proyectos_ingresados || []).map((p) => p.municipio),
      ...(boletin.resolutivos_emitidos || []).map((r) => r.municipio),
    ])
  ).filter(Boolean)

  const handleVerResumen = async () => {
    if (onVerResumen) {
      try {
        // Cargar el boletín completo desde el JSON si no está completo
        if (!boletin.proyectos_ingresados || boletin.proyectos_ingresados.length === 0) {
          const response = await fetch('/data/boletines.json')
          const data = await response.json()
          const boletinCompleto = data.boletines.find((b: Boletin) => b.id === boletin.id)
          if (boletinCompleto) {
            onVerResumen(boletinCompleto)
          } else {
            onVerResumen(boletin)
          }
        } else {
          onVerResumen(boletin)
        }
      } catch (error) {
        console.error('Error cargando datos del boletín:', error)
        // Si hay error, abrir con los datos que tenemos
        onVerResumen(boletin)
      }
    }
  }

  const handleDescargarPDF = () => {
    if (boletin.url) {
      // Intentar descargar directamente el PDF
      const link = document.createElement('a')
      link.href = boletin.url
      link.download = boletin.filename || `boletin-${boletin.id}.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleVerHistorial = () => {
    // Mostrar historial de proyectos del boletín
    if ((boletin.proyectos_ingresados || []).length > 0) {
      const expedientes = (boletin.proyectos_ingresados || []).map(p => p.expediente).filter(Boolean)
      if (expedientes.length > 0) {
        // Buscar todos los boletines que contengan estos expedientes
        // Por ahora, redirigir a la vista V1 con búsqueda de expedientes
        const searchQuery = expedientes.join(' ')
        const searchUrl = `/boletines-ssmaa?search=${encodeURIComponent(searchQuery)}&version=v1`
        window.location.href = searchUrl
      }
    } else if (onVerHistorial) {
      onVerHistorial(boletin)
    } else {
      // Si no hay proyectos, mostrar mensaje
      alert('Este boletín no tiene proyectos asociados para mostrar historial.')
    }
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      {/* Badge Nuevo */}
      {esNuevo && (
        <div className="absolute top-3 right-3 z-10">
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Nuevo
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 pr-8">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              Boletín Ambiental {boletin.id}
            </CardTitle>
            <CardDescription className="mt-1">{fechaFormateada}</CardDescription>
          </div>
        </div>

        {/* Etiquetas de categoría */}
        <div className="flex flex-wrap gap-2 mt-3">
          {tiposEstudio.slice(0, 2).map((tipo, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tipo}
            </Badge>
          ))}
          {tiposEstudio.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{tiposEstudio.length - 2} más
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metadatos con iconos */}
        <div className="space-y-2 text-sm">
          {municipios.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate" title={municipios.join(", ")}>
                {municipios.slice(0, 2).join(", ")}
                {municipios.length > 2 && ` +${municipios.length - 2}`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{fechaFormateada}</span>
          </div>

          <div className="flex items-center gap-2">
            <IconoEstado
              className="h-4 w-4 shrink-0"
              style={{ color: colorEstado }}
              aria-hidden="true"
            />
            <span className="text-sm" style={{ color: colorEstado }}>
              {textoEstado}
            </span>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex gap-4 pt-2 border-t text-sm">
          <div className="flex-1">
            <div className="font-medium">
              {formatearContador(
                boletin.cantidad_ingresados || 0,
                "proyecto",
                "proyectos"
              )}
            </div>
            <div className="text-xs text-muted-foreground">Ingresados</div>
          </div>
          <div className="flex-1">
            <div className="font-medium">
              {formatearContador(
                boletin.cantidad_resolutivos || 0,
                "resolutivo",
                "resolutivos"
              )}
            </div>
            <div className="text-xs text-muted-foreground">Emitidos</div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleVerResumen}
            className="flex-1"
            aria-label={`Ver resumen del boletín ${boletin.id}`}
          >
            <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
            Ver resumen
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDescargarPDF}
            className="flex-1"
            aria-label={`Descargar PDF del boletín ${boletin.id}`}
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Descargar PDF
          </Button>
          {boletin.proyectos_ingresados.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleVerHistorial}
              className="flex-1"
              aria-label={`Ver historial de proyectos del boletín ${boletin.id}`}
            >
              <History className="h-4 w-4 mr-2" aria-hidden="true" />
              Historial
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

