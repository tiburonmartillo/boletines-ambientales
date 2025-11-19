"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Search, RefreshCw, FileText } from "lucide-react"

interface BoletinesV2StatesProps {
  estado: 'cargando' | 'vacio_sin_filtros' | 'vacio_con_filtros' | 'error'
  onLimpiarFiltros?: () => void
  onReintentar?: () => void
  mensajeError?: string
}

export function BoletinesV2States({
  estado,
  onLimpiarFiltros,
  onReintentar,
  mensajeError
}: BoletinesV2StatesProps) {
  // Estado: Cargando
  if (estado === 'cargando') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Cargando boletines">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Estado: Vacío sin filtros
  if (estado === 'vacio_sin_filtros') {
    return (
      <Card className="text-center py-12" role="status" aria-label="No hay boletines disponibles">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-muted p-4">
            <FileText className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl">No hay boletines disponibles</CardTitle>
            <CardDescription className="text-base">
              Los boletines ambientales se publican periódicamente. 
              Vuelve pronto para ver las últimas actualizaciones.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Estado: Vacío con filtros
  if (estado === 'vacio_con_filtros') {
    return (
      <Card className="text-center py-12" role="status" aria-label="No se encontraron resultados con los filtros aplicados">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-muted p-4">
            <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl">No se encontraron resultados</CardTitle>
            <CardDescription className="text-base max-w-md">
              No hay boletines que coincidan con los filtros aplicados. 
              Intenta ajustar tus criterios de búsqueda o limpiar los filtros.
            </CardDescription>
          </div>
          {onLimpiarFiltros && (
            <Button
              onClick={onLimpiarFiltros}
              variant="outline"
              className="mt-4"
              aria-label="Limpiar todos los filtros"
            >
              Limpiar filtros
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Estado: Error
  if (estado === 'error') {
    return (
      <Card className="text-center py-12 border-destructive/50" role="alert" aria-label="Error al cargar boletines">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl text-destructive">Error al cargar boletines</CardTitle>
            <CardDescription className="text-base max-w-md">
              {mensajeError || "Ocurrió un error al intentar cargar los boletines. Por favor, intenta de nuevo más tarde."}
            </CardDescription>
          </div>
          {onReintentar && (
            <Button
              onClick={onReintentar}
              variant="outline"
              className="mt-4"
              aria-label="Reintentar cargar boletines"
            >
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Reintentar
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return null
}

