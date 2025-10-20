"use client"

import { useState, useMemo, useDeferredValue, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Proyecto, Resolutivo } from "@/lib/types"
import { MapModal } from "./map-modal"


interface ProjectsTableProps {
  proyectos: (Proyecto & { fecha_publicacion: string; boletin_url: string })[]
  resolutivos: (Resolutivo & { fecha_publicacion: string; boletin_url: string; coordenadas_x: number | null; coordenadas_y: number | null; boletin_ingreso_url: string | null })[]
  municipios: string[]
  giros: string[]
  tiposEstudio: string[]
}

export function ProjectsTable({ proyectos, resolutivos, municipios, giros, tiposEstudio }: ProjectsTableProps) {
  const [activeTab, setActiveTab] = useState<"proyectos" | "resolutivos">("proyectos")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)

  // Función para manejar el clic en la fila
  const handleRowClick = (item: any) => {
    // Solo abrir la modal si hay coordenadas disponibles
    if (item.coordenadas_x && item.coordenadas_y) {
      setSelectedItem(item)
      setIsMapModalOpen(true)
    }
  }
  
  // Debug: Log data when switching tabs
  console.log("Active tab:", activeTab)
  console.log("Proyectos count:", proyectos.length)
  console.log("Resolutivos count:", resolutivos.length)
  console.log("Sample resolutivo:", resolutivos[0])
  
  // Debug: Check for the new project specifically
  const newProject = proyectos.find(p => p.expediente === "SSMAA-DIRA-2789-2025")
  console.log("New project found:", newProject)
  console.log("Projects with date 13/10/2025:", proyectos.filter(p => p.fecha_ingreso === "13/10/2025"))
  
  const [search, setSearch] = useState("")
  const [municipioFilter, setMunicipioFilter] = useState<string>("all")
  const [giroFilter, setGiroFilter] = useState<string>("all")
  const [tipoFilter, setTipoFilter] = useState<string>("all")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Reset page when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  const currentData = activeTab === "proyectos" ? proyectos : resolutivos
  
  // Debug: Log current data
  console.log("Current data for activeTab:", activeTab, "Length:", currentData.length)
  
  // Use deferred values for better performance with large datasets
  const deferredSearch = useDeferredValue(search)
  const deferredMunicipioFilter = useDeferredValue(municipioFilter)
  const deferredGiroFilter = useDeferredValue(giroFilter)
  const deferredTipoFilter = useDeferredValue(tipoFilter)
  const deferredFechaInicio = useDeferredValue(fechaInicio)
  const deferredFechaFin = useDeferredValue(fechaFin)

  const filteredData = useMemo(() => {
    const sorted = [...currentData].sort((a, b) => {
      // Handle null dates by putting them at the end
      if (!a.fecha_ingreso && !b.fecha_ingreso) return 0
      if (!a.fecha_ingreso) return 1
      if (!b.fecha_ingreso) return -1
      
      const dateA = new Date(a.fecha_ingreso.split("/").reverse().join("-"))
      const dateB = new Date(b.fecha_ingreso.split("/").reverse().join("-"))
      return dateB.getTime() - dateA.getTime()
    })

    return sorted.filter((item) => {
      const matchesSearch =
        deferredSearch === "" ||
        (item.nombre_proyecto && item.nombre_proyecto.toLowerCase().includes(deferredSearch.toLowerCase())) ||
        (item.promovente && item.promovente.toLowerCase().includes(deferredSearch.toLowerCase())) ||
        (item.expediente && item.expediente.toLowerCase().includes(deferredSearch.toLowerCase()))
      
      // Debug search
      if (deferredSearch !== "") {
        console.log(`Searching for "${deferredSearch}" in:`, {
          expediente: item.expediente || 'null',
          nombre_proyecto: item.nombre_proyecto || 'null',
          promovente: item.promovente || 'null',
          matchesSearch
        })
      }

      const matchesMunicipio = deferredMunicipioFilter === "all" || item.municipio === deferredMunicipioFilter
      const matchesGiro = deferredGiroFilter === "all" || item.giro === deferredGiroFilter
      const matchesTipo = deferredTipoFilter === "all" || item.tipo_estudio === deferredTipoFilter

      let matchesDateRange = true
      if (deferredFechaInicio || deferredFechaFin) {
        if (!item.fecha_ingreso) {
          matchesDateRange = false // Exclude items without dates when filtering by date
        } else {
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
      }

      return matchesSearch && matchesMunicipio && matchesGiro && matchesTipo && matchesDateRange
    })
  }, [currentData, deferredSearch, deferredMunicipioFilter, deferredGiroFilter, deferredTipoFilter, deferredFechaInicio, deferredFechaFin])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  
  // Debug search results
  console.log(`Search results: ${filteredData.length} items found for search "${search}"`)

  return (
    <div className="bg-white rounded- border border-[#1E3A8A]/10 overflow-hidden">
      {/* Modern Header with Tabs */}
      <div className="border-b border-[#1E3A8A]/10 bg-[#F8FAFC]/50">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-lg">
              <Button
                variant={activeTab === "proyectos" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("proyectos")
                  setCurrentPage(1)
                }}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "proyectos" 
                    ? "bg-white text-[#000000] shadow-sm hover:text-white" 
                    : "text-[#000000]/70 hover:text-[#000000] hover:bg-blue-100"
                }`}
              >
                Proyectos Ingresados
              </Button>
              <Button
                variant={activeTab === "resolutivos" ? "default" : "ghost"}
                onClick={() => {
                  console.log("Switching to resolutivos tab")
                  setActiveTab("resolutivos")
                  setCurrentPage(1)
                }}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "resolutivos" 
                    ? "bg-white text-[#000000] shadow-sm hover:text-white" 
                    : "text-[#000000]/70 hover:text-[#000000] hover:bg-blue-100"
                }`}
              >
                Resolutivos Emitidos
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs sm:text-sm text-[#000000]/60">
                {filteredData.length} {activeTab === "proyectos" ? "proyectos" : "resolutivos"} encontrados
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - Airbnb Style */}
      <div className="p-4 sm:p-6 border-b border-[#1E3A8A]/10 bg-[#F8FAFC]/30">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          {/* Horizontal Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center w-full max-w-6xl bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
            
            {/* Search Field */}
            <div className="flex-1 w-full sm:w-auto border-r border-gray-200">
              <div className="relative p-4">
                <label className="block text-xs font-semibold text-gray-900 mb-1">Buscar</label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <Input
                    placeholder="Buscar proyectos..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10 border-0 focus:ring-0 focus:outline-none bg-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Municipio Filter */}
            <div className="flex-1 w-full sm:w-auto border-r border-gray-200">
              <div className="p-4">
                <label className="block text-xs font-semibold text-gray-900 mb-1">Municipio</label>
                <Select
                  value={municipioFilter}
                  onValueChange={(v) => {
                    setMunicipioFilter(v)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="border-0 focus:ring-0 focus:outline-none bg-transparent p-0 h-auto">
                    <SelectValue placeholder="Todos los municipios" />
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
              </div>
            </div>

            {/* Giro Filter */}
            <div className="flex-1 w-full sm:w-auto border-r border-gray-200">
              <div className="p-4">
                <label className="block text-xs font-semibold text-gray-900 mb-1">Giro</label>
                <Select
                  value={giroFilter}
                  onValueChange={(v) => {
                    setGiroFilter(v)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="border-0 focus:ring-0 focus:outline-none bg-transparent p-0 h-auto">
                    <SelectValue placeholder="Todos los giros" />
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
              </div>
            </div>

            {/* Tipo Filter */}
            <div className="flex-1 w-full sm:w-auto border-r border-gray-200">
              <div className="p-4">
                <label className="block text-xs font-semibold text-gray-900 mb-1">Tipo</label>
                <Select
                  value={tipoFilter}
                  onValueChange={(v) => {
                    setTipoFilter(v)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="border-0 focus:ring-0 focus:outline-none bg-transparent p-0 h-auto">
                    <SelectValue placeholder="Todos los tipos" />
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
            </div>

            {/* Search Button (Clear Filters) */}
            <div className="w-full sm:w-auto">
              <Button
                onClick={() => {
                  setSearch("")
                  setMunicipioFilter("all")
                  setGiroFilter("all")
                  setTipoFilter("all")
                  setFechaInicio("")
                  setFechaFin("")
                  setCurrentPage(1)
                }}
                className="w-full sm:w-auto h-full bg-red-500 hover:bg-red-600 text-white rounded-none px-8 py-4 font-semibold"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>

          {/* Date Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-6xl">
            <div className="flex-1">
              <label htmlFor="fecha-inicio" className="block text-xs font-semibold text-gray-900 mb-1">
                Fecha de inicio
              </label>
              <Input
                id="fecha-inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => {
                  setFechaInicio(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="fecha-fin" className="block text-xs font-semibold text-gray-900 mb-1">
                Fecha de fin
              </label>
              <Input
                id="fecha-fin"
                type="date"
                value={fechaFin}
                onChange={(e) => {
                  setFechaFin(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                className="w-full border-gray-200 hover:bg-gray-50"
              >
                Limpiar fechas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Expediente</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Proyecto</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Promovente</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Giro</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Municipio</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Ingreso</th>
              {activeTab === "resolutivos" && (
                <>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Resolutivo</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Referencia</th>
                </>
              )}
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ubicación</th>
              {activeTab === "resolutivos" && (
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Boletín de Ingreso</th>
              )}
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Boletín</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, idx) => (
              <tr
                key={`${item.expediente}-${idx}`}
                className={`transition-colors ${
                  item.coordenadas_x && item.coordenadas_y 
                    ? 'hover:bg-gray-50 cursor-pointer' 
                    : 'hover:bg-gray-25'
                }`}
                onClick={() => handleRowClick(item)}
              >
                <td className="py-4 px-6 font-mono text-sm text-gray-900">{item.expediente}</td>
                <td className="py-4 px-6 text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={item.nombre_proyecto || 'Sin nombre'}>
                    {item.nombre_proyecto || 'Sin nombre'}
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 max-w-xs">
                  <div className="truncate" title={item.promovente || 'Sin promovente'}>
                    {item.promovente || 'Sin promovente'}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs font-medium">
                    {item.tipo_estudio}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">{item.giro}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{item.municipio}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{item.fecha_ingreso || 'Sin fecha'}</td>
                {activeTab === "resolutivos" && "fecha_resolutivo" in item && (
                  <>
                    <td className="py-4 px-6 text-sm text-gray-600">{item.fecha_resolutivo || 'Sin fecha'}</td>
                    <td className="py-4 px-6 text-sm font-mono text-gray-900">{item.no_oficio_resolutivo || 'Sin oficio'}</td>
                  </>
                )}
                <td className="py-4 px-6">
                  {item.coordenadas_x && item.coordenadas_y ? (
                    <span className="inline-flex items-center gap-1 text-blue-600 text-sm">
                      📍 Ver ubicación
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Sin coordenadas</span>
                  )}
                </td>
                {activeTab === "resolutivos" && "boletin_ingreso_url" in item && (
                  <td className="py-4 px-6">
                    {item.boletin_ingreso_url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => item.boletin_ingreso_url && window.open(item.boletin_ingreso_url, '_blank', 'noopener,noreferrer')}
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 hover:bg-green-50 border-green-200"
                        title={`Boletín de ingreso: ${item.boletin_ingreso_url}`}
                      >
                        Boletín de Ingreso
                      </Button>
                    ) : (
                      <span className="text-gray-400 text-sm">❌ Sin boletín</span>
                    )}
                  </td>
                )}
                <td className="py-4 px-6">
                  {item.boletin_url ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(item.boletin_url, '_blank', 'noopener,noreferrer')}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200"
                      title={item.boletin_url}
                    >
                      📄 Consultar Boletín
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm">❌ Sin URL</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left side - Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mostrar:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">por página</span>
          </div>

          {/* Center - Results info */}
          <div className="flex-1 flex justify-center">
            <div className="text-sm text-gray-600 text-center">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} resultados
            </div>
          </div>

          {/* Right side - Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              {/* Page input */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Página:</span>
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value)
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page)
                    }
                  }}
                  className="w-16 h-8 text-sm text-center"
                />
                <span className="text-sm text-gray-600">de {totalPages}</span>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50"
                  title="Primera página"
                >
                  ⏮
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50"
                  title="Página anterior"
                >
                  ◀
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50"
                  title="Página siguiente"
                >
                  ▶
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50"
                  title="Última página"
                >
                  ⏭
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de ubicación */}
      {selectedItem && (
        <MapModal
          coordenadas_x={selectedItem.coordenadas_x}
          coordenadas_y={selectedItem.coordenadas_y}
          expediente={selectedItem.expediente}
          nombre_proyecto={selectedItem.nombre_proyecto || 'Sin nombre'}
          municipio={selectedItem.municipio}
          boletin_url={selectedItem.boletin_url}
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
        />
      )}
    </div>
  )
}
