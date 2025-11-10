"use client"

import { useState, useEffect } from "react"
import { Box, Flex, Heading, Text, Card, Spinner, Callout, Link } from "@radix-ui/themes"
import { DashboardStatsRadix } from "@/components/dashboard-stats-radix"
import { TimeSeriesChartRadix } from "@/components/time-series-chart-radix"
import { ProjectsTableRadix } from "@/components/projects-table-radix"
import { ProjectsMap } from "@/components/projects-map"
import { ErrorBoundary } from "@/components/error-boundary"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RadixThemeProvider } from "@/components/radix-theme-provider"
import { useDashboardData } from "@/hooks/useDashboardData"

function BoletinesAmbientalesPageContent() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  const { processedData, loading, error } = useDashboardData()
  const [highlightExpediente, setHighlightExpediente] = useState<string | null>(null)

  // Evitar SSR para prevenir hydration mismatch
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return null
  }

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        p="9"
      >
        <Flex direction="column" align="center" gap="4">
          <Spinner size="3" />
          <Heading size="5">
            Cargando datos del dashboard...
          </Heading>
        </Flex>
      </Flex>
    )
  }

  if (error || !processedData) {
    return (
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        p="9"
      >
        <Callout.Root color="red">
          <Callout.Icon>⚠️</Callout.Icon>
          <Callout.Text>
            <Flex direction="column" gap="2">
              <Heading size="4">
                Error al cargar los datos
              </Heading>
              <Text>
                {error || "No se pudieron cargar los datos del dashboard. Por favor, intenta de nuevo más tarde."}
              </Text>
            </Flex>
          </Callout.Text>
        </Callout.Root>
      </Flex>
    )
  }

  // Usar datos procesados directamente del hook
  const { stats, timeSeriesData, proyectos, resolutivos, metadata } = processedData

  const handleDateSelect = (fecha: string | null) => {
    setSelectedDate(fecha)
  }

  return (
    <Box>
      <Navbar />
      
      {/* Dashboard Header */}
      <Card mt="8">
        <Flex direction="column" gap="2" p="6">
          <Heading size="8" weight="bold">
            Dashboard de Boletines Ambientales SSMAA
          </Heading>
          <Text size="3" color="gray">
            Visualización interactiva de los boletines ambientales publicados por la Secretaría de Medio Ambiente del Estado de Aguascalientes en:
          </Text>
          <Link 
            href="https://www.aguascalientes.gob.mx/SSMAA/BoletinesSMA/usuario_webexplorer.asp" 
            target="_blank"
          >
            <Text size="3" color="gray">
              https://www.aguascalientes.gob.mx/SSMAA/BoletinesSMA
            </Text>
          </Link>
        </Flex>
      </Card>

      {/* Main Content */}
      <Flex direction="column" gap="6" p="6">

          {/* Stats Cards */}
          <ErrorBoundary>
            <DashboardStatsRadix
              totalBoletines={stats.totalBoletines}
              totalProyectos={stats.totalProyectos}
              totalResolutivos={stats.totalResolutivos}
              municipios={stats.municipios.length}
            />
          </ErrorBoundary>

          {/* Fecha de actualización */}
          <Card>
            <Flex 
              justify="center" 
              align="center"
              py="3"
              px="4"
            >
              <Text size="2" color="gray" align="center">
                Última actualización: {(() => {
                  try {
                    const date = new Date(metadata.lastUpdated)
                    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
                    const day = date.getDate()
                    const month = monthNames[date.getMonth()]
                    const year = date.getFullYear()
                    return `${day} de ${month} de ${year}`
                  } catch {
                    return 'Fecha no disponible'
                  }
                })()}
              </Text>
            </Flex>
          </Card>

          {/* Time Series Chart - Full Width */}
          <ErrorBoundary>
            <TimeSeriesChartRadix 
              data={timeSeriesData}
              onDateSelect={handleDateSelect}
            />
          </ErrorBoundary>

          {/* Projects Map */}
          <ErrorBoundary>
            <ProjectsMap 
              proyectos={proyectos} 
              onSelectExpediente={(exp) => setHighlightExpediente(exp)}
            />
          </ErrorBoundary>

          {/* Projects Table */}
          <ErrorBoundary>
            <ProjectsTableRadix
              proyectos={proyectos}
              resolutivos={resolutivos}
              municipios={stats.municipios}
              giros={stats.giros}
              tiposEstudio={stats.tiposEstudio}
              selectedDate={selectedDate}
              highlightExpediente={highlightExpediente || undefined}
            />
          </ErrorBoundary>
        </Flex>

      <Footer />
    </Box>
  )
}

export default function BoletinesAmbientalesPage() {
  return <BoletinesAmbientalesPageContent />
}
