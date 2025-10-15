"use client"

import { useState, useMemo, useDeferredValue } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Proyecto, Resolutivo } from "@/lib/types"

interface ProjectsTableProps {
  proyectos: (Proyecto & { fecha_publicacion: string; boletin_url: string })[]
  resolutivos: (Resolutivo & { fecha_publicacion: string; boletin_url: string })[]
  municipios: string[]
  giros: string[]
  tiposEstudio: string[]
}

export function ProjectsTable({ proyectos, resolutivos, municipios, giros, tiposEstudio }: ProjectsTableProps) {
  const [activeTab, setActiveTab] = useState<"proyectos" | "resolutivos">("proyectos")
  
  const [search, setSearch] = useState("")
  const [municipioFilter, setMunicipioFilter] = useState<string>("all")
  const [giroFilter, setGiroFilter] = useState<string>("all")
  const [tipoFilter, setTipoFilter] = useState<string>("all")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const currentData = activeTab === "proyectos" ? proyectos : resolutivos
  
  // Use deferred values for better performance with large datasets
  const deferredSearch = useDeferredValue(search)
  const deferredMunicipioFilter = useDeferredValue(municipioFilter)
  const deferredGiroFilter = useDeferredValue(giroFilter)
  const deferredTipoFilter = useDeferredValue(tipoFilter)
  const deferredFechaInicio = useDeferredValue(fechaInicio)
  const deferredFechaFin = useDeferredValue(fechaFin)

  const filteredData = useMemo(() => {
    const sorted = [...currentData].sort((a, b) => {
      const dateA = new Date(a.fecha_ingreso.split("/").reverse().join("-"))
      const dateB = new Date(b.fecha_ingreso.split("/").reverse().join("-"))
      return dateB.getTime() - dateA.getTime()
    })

    return sorted.filter((item) => {
      const matchesSearch =
        deferredSearch === "" ||
        item.nombre_proyecto.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        item.promovente.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        item.expediente.toLowerCase().includes(deferredSearch.toLowerCase())

      const matchesMunicipio = deferredMunicipioFilter === "all" || item.municipio === deferredMunicipioFilter
      const matchesGiro = deferredGiroFilter === "all" || item.giro === deferredGiroFilter
      const matchesTipo = deferredTipoFilter === "all" || item.tipo_estudio === deferredTipoFilter

      let matchesDateRange = true
      if (deferredFechaInicio || deferredFechaFin) {
        const itemDate = new Date(item.fecha_ingreso.split("/").reverse().join("-"))
        if (deferredFechaInicio) {
          const startDate = new Date(deferredFechaInicio)
          matchesDateRange = matchesDateRange && itemDate >= startDate
        }
        if (deferredFechaFin) {
          const endDate = new Date(deferredFechaFin)
          matchesDateRange = matchesDateRange && itemDate <= endDate
        }
      }

      return matchesSearch && matchesMunicipio && matchesGiro && matchesTipo && matchesDateRange
    })
  }, [currentData, deferredSearch, deferredMunicipioFilter, deferredGiroFilter, deferredTipoFilter, deferredFechaInicio, deferredFechaFin])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "proyectos" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("proyectos")
                setCurrentPage(1)
              }}
            >
              Proyectos Ingresados
            </Button>
            <Button
              variant={activeTab === "resolutivos" ? "default" : "outline"}
              onClick={() => {
                setActiveTab("resolutivos")
                setCurrentPage(1)
              }}
            >
              Resolutivos Emitidos
            </Button>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredData.length} {activeTab === "proyectos" ? "proyectos" : "resolutivos"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 bg-secondary border-border"
            />
          </div>

          <Select
            value={municipioFilter}
            onValueChange={(v) => {
              setMunicipioFilter(v)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Municipio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los municipios</SelectItem>
              {municipios.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={giroFilter}
            onValueChange={(v) => {
              setGiroFilter(v)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Giro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los giros</SelectItem>
              {giros.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={tipoFilter}
            onValueChange={(v) => {
              setTipoFilter(v)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {tiposEstudio.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fecha-inicio" className="text-xs text-muted-foreground font-medium">
              Fecha Inicio
            </label>
            <Input
              id="fecha-inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => {
                setFechaInicio(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-secondary border-border"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fecha-fin" className="text-xs text-muted-foreground font-medium">
              Fecha Fin
            </label>
            <Input
              id="fecha-fin"
              type="date"
              value={fechaFin}
              onChange={(e) => {
                setFechaFin(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-secondary border-border"
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setFechaInicio("")
                setFechaFin("")
                setCurrentPage(1)
              }}
              className="w-full"
            >
              Limpiar Fechas
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expediente</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Proyecto</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Promovente</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tipo</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Giro</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Municipio</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha Ingreso</th>
              {activeTab === "resolutivos" && (
                <>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha Resolutivo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Referencia</th>
                </>
              )}
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Boletín</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr
                key={`${item.expediente}-${idx}`}
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-mono text-foreground">{item.expediente}</td>
                <td className="py-3 px-4 text-sm text-foreground max-w-xs truncate" title={item.nombre_proyecto}>
                  {item.nombre_proyecto}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate" title={item.promovente}>
                  {item.promovente}
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className="text-xs">
                    {item.tipo_estudio}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{item.giro}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{item.municipio}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{item.fecha_ingreso}</td>
                {activeTab === "resolutivos" && "fecha_resolutivo" in item && (
                  <>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{item.fecha_resolutivo}</td>
                    <td className="py-3 px-4 text-sm font-mono text-foreground">{item.no_oficio_resolutivo}</td>
                  </>
                )}
                <td className="py-3 px-4">
                  {item.boletin_url ? (
                    <a
                      href={item.boletin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm font-medium"
                      title={item.boletin_url}
                    >
                      📄 Ver PDF
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">❌ Sin URL</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
