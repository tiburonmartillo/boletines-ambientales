"use client"

import { useState, useMemo, useEffect } from "react"
import { BoletinesV2Hero } from "./boletines-v2-hero"
import { BoletinesV2Filters } from "./boletines-v2-filters"
import { BoletinesV2Search } from "./boletines-v2-search"
import { BoletinesV2Card } from "./boletines-v2-card"
import { BoletinesV2States } from "./boletines-v2-states"
import { BoletinesV2SubscriptionForm } from "./boletines-v2-subscription-form"
import { BoletinesV2FAQ } from "./boletines-v2-faq"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { TableViewToggle } from "./table-view-toggle"
import { MuiDashboardStats } from "./mui-dashboard-stats"
import { MuiProjectsTable } from "./mui-projects-table"
import { ProjectsMap } from "./projects-map"
import { ErrorBoundary } from "./error-boundary"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { BoletinModal } from "./boletin-modal"
import { MuiThemeProvider } from "./mui-theme-provider"
import { ClientOnly } from "./client-only"
import { useBoletinModal } from "@/hooks/useBoletinModal"
import { useDashboardData } from "@/hooks/useDashboardData"
import { filterBoletinesV2 } from "@/lib/data-utils"
import { filterProyectos, filterResolutivos, getFilteredTimeSeriesData, getFilteredStats, type FilterOptions } from "@/lib/data-utils"
import type { Boletin } from "@/lib/types"
import { Toaster } from "@/components/ui/toaster"

export function BoletinesV2Page() {
  const { data, processedData, loading, error } = useDashboardData()
  const [mounted, setMounted] = useState(false)
  const { isOpen: isBoletinModalOpen, selectedBoletin, openModal: openBoletinModal, closeModal: closeBoletinModal } = useBoletinModal()

  // Estado de visualización de tabla (cards vs tabla)
  const [tableViewMode, setTableViewMode] = useState<"cards" | "table">("cards")

  // Estado de búsqueda y filtros
  const [search, setSearch] = useState("")
  const [filtros, setFiltros] = useState<{
    año?: string
    tipo?: string
    autoridad?: string
    municipio?: string
    estadoCumplimiento?: string
  }>({})
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Función para manejar el cambio de modo de vista
  const handleViewModeChange = (mode: "cards" | "table") => {
    console.log('handleViewModeChange called with:', mode, 'current:', tableViewMode)
    if (mode !== tableViewMode) {
      console.log('Updating tableViewMode from', tableViewMode, 'to', mode)
      setTableViewMode(mode)
      if (typeof window !== 'undefined') {
        localStorage.setItem("boletines-view-mode", mode)
      }
    } else {
      console.log('Mode is already', mode, 'skipping update')
    }
  }

  // Evitar SSR para prevenir hydration mismatch
  useEffect(() => {
    setMounted(true)
    // Cargar preferencia de visualización guardada solo si existe
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem("boletines-view-mode") as "cards" | "table" | null
      if (savedViewMode && (savedViewMode === "cards" || savedViewMode === "table")) {
        console.log('Loading saved view mode:', savedViewMode)
        setTableViewMode(savedViewMode)
      }
    }
  }, [])
  
  // Debug: Log cuando cambia tableViewMode
  useEffect(() => {
    console.log('BoletinesV2Page: tableViewMode changed to:', tableViewMode)
  }, [tableViewMode])

  // Obtener boletines de los datos
  const boletines = useMemo(() => {
    if (!data?.boletines) return []
    return data.boletines
  }, [data])

  // Filtrar y ordenar boletines según búsqueda y filtros (número de boletín del mayor al menor)
  const boletinesFiltrados = useMemo(() => {
    if (!boletines.length) return []
    const filtrados = filterBoletinesV2(boletines, {
      search,
      ...filtros,
    })
    
    // Ordenar por número de boletín del mayor al menor
    return [...filtrados].sort((a, b) => {
      return b.id - a.id // Mayor número primero
    })
  }, [boletines, search, filtros])

  // Resetear página cuando cambian los filtros o el modo de visualización
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filtros, tableViewMode])

  // Calcular paginación
  const totalPages = Math.ceil(boletinesFiltrados.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const boletinesPaginados = boletinesFiltrados.slice(startIndex, endIndex)

  // Convertir filtros V2 a FilterOptions para gráficas
  const filterOptions: FilterOptions = useMemo(() => {
    return {
      search,
      municipioFilter: filtros.municipio || "all",
      tipoFilter: filtros.tipo || "all",
      yearFilter: filtros.año || "all",
      monthFilter: "all",
      activeTab: "proyectos",
    }
  }, [search, filtros])

  // Obtener proyectos y resolutivos filtrados para gráficas
  const proyectos = processedData?.proyectos || []
  const resolutivos = processedData?.resolutivos || []
  const stats = processedData?.stats || {
    totalBoletines: 0,
    totalProyectos: 0,
    totalResolutivos: 0,
    municipios: [],
    giros: [],
    tiposEstudio: [],
  }

  const filteredProyectos = useMemo(() => {
    if (!proyectos.length) return []
    return filterProyectos(proyectos, filterOptions)
  }, [proyectos, filterOptions])

  const filteredResolutivos = useMemo(() => {
    if (!resolutivos.length) return []
    return filterResolutivos(resolutivos, filterOptions)
  }, [resolutivos, filterOptions])

  const filteredTimeSeriesData = useMemo(() => {
    if (!proyectos.length) return []
    return getFilteredTimeSeriesData(proyectos, resolutivos, filterOptions)
  }, [proyectos, resolutivos, filterOptions])

  const filteredStats = useMemo(() => {
    if (!proyectos.length) {
      return {
        totalBoletines: 0,
        totalProyectos: 0,
        totalResolutivos: 0,
        municipios: [],
        giros: [],
        tiposEstudio: [],
      }
    }
    return getFilteredStats(proyectos, resolutivos, filterOptions, stats.totalBoletines)
  }, [proyectos, resolutivos, filterOptions, stats.totalBoletines])


  // Determinar estado de la interfaz
  const estadoInterfaz = useMemo(() => {
    if (loading) return "cargando"
    if (error) return "error"
    if (boletinesFiltrados.length === 0) {
      const tieneFiltros = search || Object.values(filtros).some((v) => v && v !== "all")
      return tieneFiltros ? "vacio_con_filtros" : "vacio_sin_filtros"
    }
    return "contenido"
  }, [loading, error, boletinesFiltrados.length, search, filtros])

  // Obtener municipios únicos para el formulario de suscripción
  const municipios = useMemo(() => {
    return Array.from(
      new Set([
        ...boletines.flatMap((b) =>
          (b.proyectos_ingresados || []).map((p) => p.municipio)
        ),
        ...boletines.flatMap((b) =>
          (b.resolutivos_emitidos || []).map((r) => r.municipio)
        ),
      ])
    ).filter(Boolean) as string[]
  }, [boletines])

  if (!mounted) {
    return null
  }

  return (
    <MuiThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Toaster />

        {/* Indicador de Versión V2 */}
        <div className="fixed top-20 right-4 z-[9999] bg-primary text-primary-foreground px-3 py-1.5 rounded-md shadow-lg text-sm font-bold">
          VISTA V2 | Modo: {tableViewMode === "cards" ? "CARDS" : "TABLA"}
        </div>

        {/* Hero Section */}
        <BoletinesV2Hero />

        {/* Switch de visualización - arriba de la tabla */}
        <div className="w-full bg-yellow-300 py-6 border-t-4 border-b-4 border-red-600 relative" style={{ zIndex: 1000 }}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-center items-center">
              <div className="flex items-center px-6 py-4 bg-white rounded-lg border-4 border-black shadow-2xl">
                <TableViewToggle 
                  viewMode={tableViewMode}
                  onViewModeChange={handleViewModeChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div id="boletines-content" className="container mx-auto px-4 md:px-6 py-8 space-y-8">
          {/* Estadísticas */}
          {!loading && !error && (
            <ClientOnly>
              <ErrorBoundary>
                <MuiDashboardStats
                  totalBoletines={filteredStats.totalBoletines}
                  totalProyectos={filteredStats.totalProyectos}
                  totalResolutivos={filteredStats.totalResolutivos}
                  municipios={filteredStats.municipios.length}
                />
              </ErrorBoundary>
            </ClientOnly>
          )}

          {/* Filtros */}
          {!loading && !error && boletines.length > 0 && (
            <BoletinesV2Filters
              boletines={boletines}
              filtros={filtros}
              onFiltrosChange={setFiltros}
              resultados={boletinesFiltrados.length}
            />
          )}

          {/* Buscador */}
          {!loading && !error && boletines.length > 0 && (
            <BoletinesV2Search
              value={search}
              onChange={setSearch}
              resultados={boletinesFiltrados.length}
            />
          )}

          {/* Contenido: Estados, Cards o Tabla */}
          {estadoInterfaz === "contenido" ? (
            <>
              {tableViewMode === "cards" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {boletinesPaginados.map((boletin) => (
                      <BoletinesV2Card 
                        key={boletin.id} 
                        boletin={boletin}
                        onVerResumen={openBoletinModal}
                      />
                    ))}
                  </div>
                  
                  {/* Paginación para cards */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 border-t">
                      <div className="text-sm text-muted-foreground">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, boletinesFiltrados.length)} de {boletinesFiltrados.length} boletines
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Anterior
                        </Button>
                        <div className="text-sm text-muted-foreground">
                          Página {currentPage} de {totalPages}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <ClientOnly>
                  <ErrorBoundary>
                    <MuiProjectsTable
                      proyectos={boletinesFiltrados.flatMap(b => 
                        (b.proyectos_ingresados || []).map(p => ({
                          ...p,
                          fecha_publicacion: b.fecha_publicacion,
                          boletin_url: b.url
                        }))
                      )}
                      resolutivos={boletinesFiltrados.flatMap(b => 
                        (b.resolutivos_emitidos || []).map(r => ({
                          ...r,
                          fecha_publicacion: b.fecha_publicacion,
                          boletin_url: b.url,
                          boletin_ingreso_url: b.url
                        }))
                      )}
                      municipios={filteredStats.municipios}
                      giros={filteredStats.giros}
                      tiposEstudio={filteredStats.tiposEstudio}
                    />
                  </ErrorBoundary>
                </ClientOnly>
              )}
            </>
          ) : (
            <BoletinesV2States
              estado={estadoInterfaz}
              onLimpiarFiltros={() => {
                setSearch("")
                setFiltros({})
              }}
              onReintentar={() => window.location.reload()}
              mensajeError={error || undefined}
            />
          )}

          {/* Mapa de proyectos */}
          {!loading && !error && filteredProyectos.length > 0 && (
            <ClientOnly>
              <ErrorBoundary>
                <div id="projects-map" data-map-container>
                  <ProjectsMap proyectos={filteredProyectos} />
                </div>
              </ErrorBoundary>
            </ClientOnly>
          )}

          {/* Formulario de suscripción */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BoletinesV2SubscriptionForm municipios={municipios} />
            <BoletinesV2FAQ />
          </div>
        </div>

        <Footer />
      </div>
      
      {/* Modal de resumen de boletín - solo renderizar después de montar */}
      {mounted && (
        <BoletinModal 
          boletin={selectedBoletin} 
          isOpen={isBoletinModalOpen} 
          onClose={closeBoletinModal} 
        />
      )}
    </MuiThemeProvider>
  )
}

