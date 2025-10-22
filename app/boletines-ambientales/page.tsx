"use client"

import { useState, useEffect } from "react"
import { Box, Container, Typography, Paper, CircularProgress, Alert, Link } from "@mui/material"
import { MuiDashboardStats } from "@/components/mui-dashboard-stats"
import { MuiTimeSeriesChart } from "@/components/mui-time-series-chart"
import { MuiProjectsTable } from "@/components/mui-projects-table"
import { ErrorBoundary } from "@/components/error-boundary"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MuiThemeProvider } from "@/components/mui-theme-provider"
import { useDashboardData } from "@/hooks/useDashboardData"

function BoletinesAmbientalesContent() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  
  const { processedData, loading, error } = useDashboardData()

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <CircularProgress size={60} sx={{ color: 'primary.main', mb: 3 }} />
          <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
            Cargando datos del dashboard...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error || !processedData) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Error al cargar los datos
          </Typography>
          <Typography variant="body2">
            {error || "No se pudieron cargar los datos del dashboard. Por favor, intenta de nuevo más tarde."}
          </Typography>
        </Alert>
      </Box>
    )
  }

  // Usar datos procesados directamente del hook
  const { stats, timeSeriesData, proyectos, resolutivos, metadata } = processedData

  const handleDateSelect = (fecha: string | null) => {
    setSelectedDate(fecha)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      
      {/* Dashboard Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          mt: '80px', 
          bgcolor: 'background.paper',
          borderRadius: 0
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                Boletines Ambientales
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                Visualización interactiva de los boletines ambientales publicados por la Secretaría de Medio Ambiente del Estado de Aguascalientes en:
              </Typography>
              <Link href="https://www.aguascalientes.gob.mx/SSMAA/BoletinesSMA/usuario_webexplorer.asp" target="_blank">
                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                https://www.aguascalientes.gob.mx/SSMAA/BoletinesSMA
                </Typography>
              </Link>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* Stats Cards */}
          <ErrorBoundary>
            <MuiDashboardStats
              totalBoletines={stats.totalBoletines}
              totalProyectos={stats.totalProyectos}
              totalResolutivos={stats.totalResolutivos}
              municipios={stats.municipios.length}
            />
          </ErrorBoundary>

          {/* Fecha de actualización */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 2,
            px: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid rgba(30, 58, 138, 0.1)'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Última actualización: {new Date(metadata.lastUpdated).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} 
            </Typography>
          </Box>

          {/* Time Series Chart - Full Width */}
          <ErrorBoundary>
            <MuiTimeSeriesChart 
              data={timeSeriesData}
              onDateSelect={handleDateSelect}
            />
          </ErrorBoundary>

          {/* Projects Table */}
          <ErrorBoundary>
            <MuiProjectsTable
              proyectos={proyectos}
              resolutivos={resolutivos}
              municipios={stats.municipios}
              giros={stats.giros}
              tiposEstudio={stats.tiposEstudio}
              selectedDate={selectedDate}
            />
          </ErrorBoundary>
        </Box>
      </Container>

      <Footer />
    </Box>
  )
}

export default function BoletinesAmbientalesPage() {
  return (
    <MuiThemeProvider>
      <BoletinesAmbientalesContent />
    </MuiThemeProvider>
  )
}