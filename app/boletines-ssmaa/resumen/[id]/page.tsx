'use client'

import React, { useState, useEffect } from 'react'
import { Box, Container, Typography, Button, Alert, CircularProgress, Breadcrumbs, Link } from '@mui/material'
import { BoletinSummary } from '@/components/boletin-summary'
import { useBoletinSummary } from '@/hooks/useBoletinSummary'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MuiThemeProvider } from '@/components/mui-theme-provider'
import { generateBoletinPDF } from '@/lib/pdf-generator'

interface ResumenBoletinPageProps {
  params: Promise<{ id: string }>
}

export default function ResumenBoletinPage({ params }: ResumenBoletinPageProps) {
  const [boletinId, setBoletinId] = useState<number | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Resolver params
  useEffect(() => {
    params.then(({ id }) => {
      const idNumber = parseInt(id)
      if (!isNaN(idNumber)) {
        setBoletinId(idNumber)
      }
    })
  }, [params])

  const { boletin, loading, error, isValid } = useBoletinSummary(boletinId || 0)

  const handleDownloadPDF = async () => {
    if (!boletin) return

    try {
      setIsGeneratingPDF(true)
      await generateBoletinPDF('boletin-summary', `Resumen-Boletin-SSMAA-${boletin.id}.pdf`)
    } catch (err) {
      console.error('Error al generar PDF:', err)
      alert('Error al generar el PDF. Por favor, intenta de nuevo.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleBackToDashboard = () => {
    window.location.href = '/boletines-ssmaa'
  }

  if (!boletinId) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navbar />
          <Container maxWidth="lg" sx={{ py: 4, mt: '80px' }}>
            <Alert severity="error">
              ID de boletín inválido
            </Alert>
          </Container>
          <Footer />
        </Box>
      </MuiThemeProvider>
    )
  }

  if (loading) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navbar />
          <Container maxWidth="lg" sx={{ py: 4, mt: '80px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ color: 'primary.main', mb: 3 }} />
                <Typography variant="h6" color="text.primary">
                  Cargando resumen del boletín...
                </Typography>
              </Box>
            </Box>
          </Container>
          <Footer />
        </Box>
      </MuiThemeProvider>
    )
  }

  if (error || !isValid) {
    return (
      <MuiThemeProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navbar />
          <Container maxWidth="lg" sx={{ py: 4, mt: '80px' }}>
            <Alert severity="error" sx={{ maxWidth: 600 }}>
              <Typography variant="h6" gutterBottom>
                Error al cargar el boletín
              </Typography>
              <Typography variant="body2">
                {error || 'No se pudo cargar el boletín solicitado.'}
              </Typography>
              <Button 
                variant="outlined" 
                onClick={handleBackToDashboard}
                sx={{ mt: 2 }}
              >
                Volver al Dashboard
              </Button>
            </Alert>
          </Container>
          <Footer />
        </Box>
      </MuiThemeProvider>
    )
  }

  return (
    <MuiThemeProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        
        {/* Breadcrumbs */}
        <Container maxWidth="lg" sx={{ mt: '80px', pt: 2 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link 
              color="inherit" 
              href="/boletines-ssmaa"
              sx={{ textDecoration: 'none' }}
            >
              Dashboard SSMAA
            </Link>
            <Typography color="text.primary">
              Resumen Boletín #{boletin.id}
            </Typography>
          </Breadcrumbs>
        </Container>

        {/* Contenido principal */}
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <BoletinSummary
            boletin={boletin}
            showPrintButton={true}
            showDownloadButton={true}
            onDownloadPDF={handleDownloadPDF}
          />

          {/* Botones de navegación */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBackToDashboard}
              sx={{
                borderColor: '#F97316',
                color: '#F97316',
                '&:hover': {
                  borderColor: '#EA580C',
                  backgroundColor: '#FFF7ED'
                }
              }}
            >
              Volver al Dashboard
            </Button>
            
            <Button
              variant="contained"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              sx={{
                backgroundColor: '#F97316',
                '&:hover': {
                  backgroundColor: '#EA580C'
                }
              }}
            >
              {isGeneratingPDF ? 'Generando PDF...' : 'Descargar PDF'}
            </Button>
          </Box>
        </Container>

        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}
