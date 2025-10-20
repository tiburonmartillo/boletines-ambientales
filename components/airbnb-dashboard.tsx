"use client"

import { useState, useMemo, useDeferredValue, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapModal } from "./map-modal"
import { coordinateValidator } from "@/lib/coordinate-validator"

interface Proyecto {
  expediente: string
  nombre_proyecto?: string
  promovente?: string
  tipo_estudio: string
  giro?: string
  municipio: string
  fecha_ingreso?: string
  coordenadas_x: number | null
  coordenadas_y: number | null
  boletin_url: string
}

interface Resolutivo extends Proyecto {
  fecha_resolutivo?: string
  no_oficio_resolutivo?: string
  boletin_ingreso_url?: string
}

interface AirbnbDashboardProps {
  proyectos: (Proyecto & { fecha_publicacion: string; boletin_url: string })[]
  resolutivos: (Resolutivo & { fecha_publicacion: string; boletin_url: string; coordenadas_x: number | null; coordenadas_y: number | null; boletin_ingreso_url: string | null })[]
  municipios: string[]
  giros: string[]
  tiposEstudio: string[]
}

export function AirbnbDashboard({ proyectos, resolutivos, municipios, giros, tiposEstudio }: AirbnbDashboardProps) {
  const [activeTab, setActiveTab] = useState<"proyectos" | "resolutivos">("proyectos")
  const [searchTerm, setSearchTerm] = useState("")
  const [municipioFilter, setMunicipioFilter] = useState<string>("all")
  const [giroFilter, setGiroFilter] = useState<string>("all")
  const [tipoFilter, setTipoFilter] = useState<string>("all")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)

  // Reset page when filters change
  useEffect(() => {
    // Reset any pagination if needed
  }, [searchTerm, municipioFilter, giroFilter, tipoFilter, fechaInicio, fechaFin, activeTab])

  const currentData = activeTab === "proyectos" ? proyectos : resolutivos
  
  // Use deferred values for better performance with large datasets
  const deferredSearch = useDeferredValue(searchTerm)
  const deferredMunicipioFilter = useDeferredValue(municipioFilter)
  const deferredGiroFilter = useDeferredValue(giroFilter)
  const deferredTipoFilter = useDeferredValue(tipoFilter)
  const deferredFechaInicio = useDeferredValue(fechaInicio)
  const deferredFechaFin = useDeferredValue(fechaFin)

  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      // Search filter
      if (deferredSearch) {
        const searchLower = deferredSearch.toLowerCase()
        const matchesSearch = 
          item.expediente.toLowerCase().includes(searchLower) ||
          (item.nombre_proyecto && item.nombre_proyecto.toLowerCase().includes(searchLower)) ||
          (item.promovente && item.promovente.toLowerCase().includes(searchLower)) ||
          (item.municipio && item.municipio.toLowerCase().includes(searchLower))
        
        if (!matchesSearch) return false
      }

      // Municipio filter
      if (deferredMunicipioFilter !== "all" && item.municipio !== deferredMunicipioFilter) {
        return false
      }

      // Giro filter
      if (deferredGiroFilter !== "all" && item.giro !== deferredGiroFilter) {
        return false
      }

      // Tipo filter
      if (deferredTipoFilter !== "all" && item.tipo_estudio !== deferredTipoFilter) {
        return false
      }

      // Date range filter
      if (deferredFechaInicio || deferredFechaFin) {
        const itemDate = new Date(item.fecha_ingreso || '')
        if (isNaN(itemDate.getTime())) return false

        if (deferredFechaInicio) {
          const startDate = new Date(deferredFechaInicio)
          if (itemDate < startDate) return false
        }

        if (deferredFechaFin) {
          const endDate = new Date(deferredFechaFin)
          if (itemDate > endDate) return false
        }
      }

      return true
    })
  }, [currentData, deferredSearch, deferredMunicipioFilter, deferredGiroFilter, deferredTipoFilter, deferredFechaInicio, deferredFechaFin])

  // Función para manejar el clic en la fila
  const handleRowClick = (item: any) => {
    if (item.coordenadas_x && item.coordenadas_y) {
      setSelectedItem(item)
      setIsMapModalOpen(true)
    }
  }

  // Función para convertir coordenadas usando el validador
  const convertToLatLong = (x: number | null, y: number | null): { lat: number; lng: number } | null => {
    if (!x || !y) return null

    const validationResult = coordinateValidator.processCoordinates(x, y);
    
    if (!validationResult.success) {
      console.warn('Coordenadas inválidas:', validationResult.error);
      return null;
    }

    const correctedX = validationResult.corrected.x;
    const correctedY = validationResult.corrected.y;

    if (validationResult.type === 'latlng') {
      return { lat: correctedY, lng: correctedX };
    }

    if (validationResult.type === 'utm') {
      // Conversión UTM simplificada para el mapa
      const lat = 21.8818 + (correctedY - 2430000) / 111000
      const lng = -102.2916 + (correctedX - 750000) / 85000
      return { lat, lng }
    }

    return null;
  }

  // Generar marcadores para el mapa
  const mapMarkers = filteredData
    .filter(item => item.coordenadas_x && item.coordenadas_y)
    .map((item, index) => {
      const coords = convertToLatLong(item.coordenadas_x, item.coordenadas_y)
      if (!coords) return null
      
      return {
        id: item.expediente,
        lat: coords.lat,
        lng: coords.lng,
        title: item.nombre_proyecto || item.expediente,
        expediente: item.expediente,
        municipio: item.municipio,
        tipo: item.tipo_estudio,
        color: activeTab === "proyectos" ? "#F97316" : "#1E3A8A"
      }
    })
    .filter(Boolean)

  // Generar URL del mapa simplificada para evitar URLs demasiado largas
  const generateMapUrl = () => {
    if (mapMarkers.length === 0) return ""
    
    const centerLat = mapMarkers.reduce((sum, marker) => sum + marker!.lat, 0) / mapMarkers.length
    const centerLng = mapMarkers.reduce((sum, marker) => sum + marker!.lng, 0) / mapMarkers.length
    
    // Usar un mapa centrado sin marcadores para evitar URL larga
    return `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng-0.3},${centerLat-0.3},${centerLng+0.3},${centerLat+0.3}&layer=mapnik&marker=${centerLat},${centerLng}`
  }

  // Función alternativa para generar mapa estático
  const generateStaticMapUrl = () => {
    if (mapMarkers.length === 0) return ""
    
    const centerLat = mapMarkers.reduce((sum, marker) => sum + marker!.lat, 0) / mapMarkers.length
    const centerLng = mapMarkers.reduce((sum, marker) => sum + marker!.lng, 0) / mapMarkers.length
    
    // Usar mapa estático de OpenStreetMap con coordenadas centradas
    return `https://tile.openstreetmap.org/cgi-bin/export?bbox=${centerLng-0.2},${centerLat-0.2},${centerLng+0.2},${centerLat+0.2}&scale=10000&format=png`
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Ambiental</h1>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={activeTab === "proyectos" ? "default" : "ghost"}
              onClick={() => setActiveTab("proyectos")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === "proyectos" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Proyectos Ingresados
            </Button>
            <Button
              variant={activeTab === "resolutivos" ? "default" : "ghost"}
              onClick={() => setActiveTab("resolutivos")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === "resolutivos" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Resolutivos Emitidos
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <Input
                placeholder="Expediente, proyecto, promovente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
              <Select value={municipioFilter} onValueChange={setMunicipioFilter}>
                <SelectTrigger>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giro</label>
              <Select value={giroFilter} onValueChange={setGiroFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los giros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los giros</SelectItem>
                  {giros.map((giro) => (
                    <SelectItem key={giro} value={giro}>
                      {giro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Estudio</label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
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
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Table */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredData.length} {activeTab === "proyectos" ? "proyectos" : "resolutivos"} en Aguascalientes
              </h2>
              <div className="text-sm text-gray-500">
                {mapMarkers.length} con ubicación
              </div>
            </div>

            {/* Table */}
            <div className="space-y-3">
              {filteredData.slice(0, 20).map((item, index) => {
                const coords = convertToLatLong(item.coordenadas_x, item.coordenadas_y)
                return (
                  <Card 
                    key={`${item.expediente}-${index}`}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      coords ? 'hover:border-orange-300' : 'opacity-60'
                    }`}
                    onClick={() => handleRowClick(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            {item.tipo_estudio}
                          </Badge>
                          <span className="text-sm font-mono text-gray-600">{item.expediente}</span>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {item.nombre_proyecto || 'Sin nombre'}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {item.promovente || 'Sin promovente'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📍 {item.municipio}</span>
                          <span>📅 {item.fecha_ingreso || 'Sin fecha'}</span>
                          {item.giro && <span>🏭 {item.giro}</span>}
                        </div>
                        
                        {activeTab === "resolutivos" && "fecha_resolutivo" in item && (
                          <div className="mt-2 text-xs text-gray-500">
                            <span>📋 Resolutivo: {item.fecha_resolutivo || 'Sin fecha'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex flex-col items-end gap-2">
                        {coords ? (
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        ) : (
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        )}
                        
                        {item.boletin_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(item.boletin_url, '_blank', 'noopener,noreferrer')
                            }}
                            className="text-xs px-2 py-1 h-6"
                          >
                            📄 Boletín
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="w-1/2 relative">
          {mapMarkers.length > 0 ? (
            <div className="h-full">
              {/* Mapa simplificado sin marcadores para evitar URL larga */}
              <iframe
                src={generateMapUrl()}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="Mapa de proyectos"
                allowFullScreen
              />
              
              {/* Información sobre ubicaciones */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-sm">
                <div className="text-gray-700">
                  {mapMarkers.length} ubicaciones encontradas
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Haz clic en las tarjetas para ver detalles
                </div>
              </div>
              
              {/* Leyenda de colores */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-gray-700">Proyectos</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-700">Resolutivos</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center">
                <div className="text-gray-500 mb-2">📍</div>
                <div className="text-gray-600">No hay proyectos con ubicación</div>
                <div className="text-sm text-gray-500 mt-1">
                  Ajusta los filtros para ver más resultados
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de ubicación */}
      {selectedItem && isMapModalOpen && (
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
