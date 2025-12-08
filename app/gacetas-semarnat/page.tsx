"use client"

import { useState, useEffect } from "react"
import { Box, Container, Typography, CircularProgress, Alert, Link, Paper } from "@mui/material"
import { MuiGacetasStats } from "@/components/mui-gacetas-stats"
import { ErrorBoundary } from "@/components/error-boundary"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MuiThemeProvider } from "@/components/mui-theme-provider"
import { useGacetasData } from "@/hooks/useGacetasData"
import { MuiGacetasProjectsTable } from "@/components/mui-gacetas-projects-table"

function GacetasSEMARNATPageContent() {
  const [mounted, setMounted] = useState(false)
  
  const { processedData, loading, error, data } = useGacetasData()

  // Evitar SSR para prevenir hydration mismatch (MUI/emotion)
  useEffect(() => { setMounted(true) }, [])

  // Extraer datos de forma segura (puede ser null)
  const stats = processedData?.stats
  const proyectos = processedData?.proyectos || []
  const resolutivos = processedData?.resolutivos || []
  const metadata = processedData?.metadata
  
  // Obtener rango de años de los datos
  const yearRange = data?.metadata?.year_range || `${new Date().getFullYear()}`

  // Ahora sí, los returns condicionales
  if (!mounted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <CircularProgress size={60} sx={{ color: 'primary.main', mb: 3 }} />
          <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
            Cargando datos de gacetas...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esto puede tardar unos momentos...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error || !processedData || !stats) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Error al cargar los datos
          </Typography>
          <Typography variant="body2" component="pre" sx={{ mt: 2, whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
            {error || "No se pudieron cargar los datos de gacetas. Por favor, intenta de nuevo más tarde."}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Verifica que el archivo JSON esté disponible en: <code>/data/gacetas_semarnat_analizadas.json</code>
          </Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      
      {/* Dashboard Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          mt: { xs: '64px', sm: '80px' }, 
          bgcolor: 'background.paper',
          borderRadius: 0
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="bold" 
                color="text.primary"
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                  lineHeight: { xs: 1.3, sm: 1.4 }
                }}
              >
          Gacetas Ecológicas SEMARNAT
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                sx={{ 
                  mt: { xs: 0.5, sm: 0.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: { xs: 1.5, sm: 1.6 }
                }}
              >
                Visualización interactiva de las gacetas ecológicas publicadas por la Secretaría de Medio Ambiente y Recursos Naturales (SEMARNAT) en:
              </Typography>
              <Link 
                href="https://www.semarnat.gob.mx/gobmx/transparencia/gaceta.html" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  display: 'inline-block',
                  mt: { xs: 0.5, sm: 0.5 },
                  wordBreak: 'break-all'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  color="primary" 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    textDecoration: 'underline'
                  }}
                >
                  https://www.semarnat.gob.mx/gobmx/transparencia/gaceta.html
                </Typography>
              </Link>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3, md: 4 } }}>

          {/* Stats Cards */}
          <ErrorBoundary>
            <MuiGacetasStats
              totalGacetas={stats.totalGacetas}
              municipios={stats.municipios.length}
              yearRange={yearRange}
              totalProyectos={stats.totalProyectos}
              totalResolutivos={stats.totalResolutivos}
            />
          </ErrorBoundary>

          {/* Fecha de actualización */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 3 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid rgba(30, 58, 138, 0.1)'
          }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                textAlign: 'center',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: { xs: 1.4, sm: 1.5 }
              }}
            >
              Última actualización: {(() => {
                try {
                  if (!metadata?.lastUpdated) return 'Fecha no disponible'
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
            </Typography>
          </Box>

          {/* Projects and Resolutions Table */}
          <ErrorBoundary>
            <MuiGacetasProjectsTable
              proyectos={proyectos}
              resolutivos={resolutivos}
              municipios={stats?.municipios || []}
            />
          </ErrorBoundary>

          {/* Iframe de Notion */}
          <Box sx={{ 
            mt: 4,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(30, 58, 138, 0.1)',
            width: '100%'
          }}>
            <iframe 
              src="https://adnags.notion.site/ebd/29c2b8101e5c80fdbd89f8c03728e80d" 
              width="100%" 
              height="900"
              frameBorder="0"
              allowFullScreen
              scrolling="no"
              style={{ 
                display: 'block',
                minHeight: '600px',
                overflow: 'hidden'
              }}
              title="Formulario de suscripción al boletín semanal"
            />
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  )
}

export default function GacetasSEMARNATPage() {
  return (
    <MuiThemeProvider>
      <GacetasSEMARNATPageContent />
    </MuiThemeProvider>
  )
}

