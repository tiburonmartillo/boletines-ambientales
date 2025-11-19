"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"
import { formatearContador } from "@/lib/boletines-v2-utils"
import type { Boletin } from "@/lib/types"
import { obtenerAutoridad, calcularEstadoCumplimiento } from "@/lib/boletines-v2-utils"

interface BoletinesV2FiltersProps {
  boletines: Boletin[]
  filtros: {
    año?: string
    tipo?: string
    autoridad?: string
    municipio?: string
    estadoCumplimiento?: string
  }
  onFiltrosChange: (filtros: {
    año?: string
    tipo?: string
    autoridad?: string
    municipio?: string
    estadoCumplimiento?: string
  }) => void
  resultados: number
}

export function BoletinesV2Filters({
  boletines,
  filtros,
  onFiltrosChange,
  resultados,
}: BoletinesV2FiltersProps) {
  const [filtrosLocales, setFiltrosLocales] = useState(filtros)

  // Sincronizar filtros locales con props
  useEffect(() => {
    setFiltrosLocales(filtros)
  }, [filtros])

  // Obtener opciones únicas para cada filtro
  const años = Array.from(
    new Set(boletines.map((b) => new Date(b.fecha_publicacion).getFullYear()))
  )
    .filter((año) => !isNaN(año))
    .sort((a, b) => b - a)

  const tiposEstudio = Array.from(
    new Set([
      ...boletines.flatMap((b) =>
        (b.proyectos_ingresados || []).map((p) => p.tipo_estudio)
      ),
      ...boletines.flatMap((b) =>
        (b.resolutivos_emitidos || []).map((r) => r.tipo_estudio)
      ),
    ])
  ).filter(Boolean)

  const autoridades = Array.from(
    new Set(boletines.map((b) => obtenerAutoridad(b)))
  ).filter((a) => a !== "No especificada")

  const municipios = Array.from(
    new Set([
      ...boletines.flatMap((b) =>
        (b.proyectos_ingresados || []).map((p) => p.municipio)
      ),
      ...boletines.flatMap((b) =>
        (b.resolutivos_emitidos || []).map((r) => r.municipio)
      ),
    ])
  ).filter(Boolean)

  const estadosCumplimiento = [
    { value: "all", label: "Todos" },
    { value: "con_resolutivo", label: "Con resolutivo" },
    { value: "sin_resolutivo", label: "Sin resolutivo" },
    { value: "en_proceso", label: "En proceso" },
  ]

  const tieneFiltrosActivos = Object.values(filtrosLocales).some(
    (valor) => valor && valor !== "all"
  )

  const handleAplicar = () => {
    onFiltrosChange(filtrosLocales)
  }

  const handleLimpiar = () => {
    const filtrosLimpios = {
      año: undefined,
      tipo: undefined,
      autoridad: undefined,
      municipio: undefined,
      estadoCumplimiento: undefined,
    }
    setFiltrosLocales(filtrosLimpios)
    onFiltrosChange(filtrosLimpios)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" aria-hidden="true" />
            Filtros
          </CardTitle>
          {tieneFiltrosActivos && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLimpiar}
              className="h-8"
              aria-label="Limpiar todos los filtros"
            >
              <X className="h-4 w-4 mr-1" aria-hidden="true" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Filtro: Año */}
          <div className="space-y-2">
            <Label htmlFor="filtro-año">Año</Label>
            <Select
              value={filtrosLocales.año || "all"}
              onValueChange={(value) =>
                setFiltrosLocales({ ...filtrosLocales, año: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger id="filtro-año" className="w-full">
                <SelectValue placeholder="Todos los años" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los años</SelectItem>
                {años.map((año) => (
                  <SelectItem key={año} value={año.toString()}>
                    {año}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro: Tipo de proyecto */}
          <div className="space-y-2">
            <Label htmlFor="filtro-tipo">Tipo de proyecto</Label>
            <Select
              value={filtrosLocales.tipo || "all"}
              onValueChange={(value) =>
                setFiltrosLocales({ ...filtrosLocales, tipo: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger id="filtro-tipo" className="w-full">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {tiposEstudio.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro: Autoridad */}
          <div className="space-y-2">
            <Label htmlFor="filtro-autoridad">Autoridad</Label>
            <Select
              value={filtrosLocales.autoridad || "all"}
              onValueChange={(value) =>
                setFiltrosLocales({
                  ...filtrosLocales,
                  autoridad: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="filtro-autoridad" className="w-full">
                <SelectValue placeholder="Todas las autoridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las autoridades</SelectItem>
                {autoridades.map((autoridad) => (
                  <SelectItem key={autoridad} value={autoridad}>
                    {autoridad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro: Municipio */}
          <div className="space-y-2">
            <Label htmlFor="filtro-municipio">Municipio</Label>
            <Select
              value={filtrosLocales.municipio || "all"}
              onValueChange={(value) =>
                setFiltrosLocales({
                  ...filtrosLocales,
                  municipio: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="filtro-municipio" className="w-full">
                <SelectValue placeholder="Todos los municipios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los municipios</SelectItem>
                {municipios.map((municipio) => (
                  <SelectItem key={municipio} value={municipio}>
                    {municipio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro: Estado de cumplimiento */}
          <div className="space-y-2">
            <Label htmlFor="filtro-estado">Estado de cumplimiento</Label>
            <Select
              value={filtrosLocales.estadoCumplimiento || "all"}
              onValueChange={(value) =>
                setFiltrosLocales({
                  ...filtrosLocales,
                  estadoCumplimiento: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="filtro-estado" className="w-full">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                {estadosCumplimiento.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botones y contador */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {formatearContador(resultados, "boletín", "boletines")} encontrados
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLimpiar} disabled={!tieneFiltrosActivos}>
              Limpiar filtros
            </Button>
            <Button onClick={handleAplicar}>Aplicar filtros</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

