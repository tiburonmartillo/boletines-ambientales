import React from 'react'
import { Box, Container, Typography, Alert, Breadcrumbs, Link } from '@mui/material'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MuiThemeProvider } from '@/components/mui-theme-provider'
import { BoletinSummaryWrapper } from '@/components/boletin-summary-wrapper'
import { Boletin } from '@/lib/types'
import fs from 'fs'
import path from 'path'

interface ResumenBoletinPageProps {
  params: Promise<{ id: string }>
}

// Función para generar parámetros estáticos
export async function generateStaticParams() {
  try {
    // Cargar datos de boletines usando fs.readFileSync
    const filePath = path.join(process.cwd(), 'public', 'data', 'boletines.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    // Generar parámetros para TODOS los boletines disponibles
    // Esto asegura que todas las rutas estén disponibles
    return data.boletines.map((boletin: Boletin) => ({
      id: boletin.id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    // Fallback: generar algunos IDs comunes
    return [
      { id: '453' },
      { id: '452' },
      { id: '451' },
      { id: '450' },
      { id: '449' },
      { id: '448' },
      { id: '447' },
      { id: '446' },
      { id: '445' },
      { id: '444' }
    ]
  }
}

// Función para obtener datos del boletín en el servidor
async function getBoletinData(boletinId: number): Promise<Boletin | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'boletines.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    return data.boletines.find((b: Boletin) => b.id === boletinId) || null
  } catch (error) {
    console.error('Error loading boletin data:', error)
    return null
  }
}

export default async function ResumenBoletinPage({ params }: ResumenBoletinPageProps) {
  const { id } = await params
  const boletinId = parseInt(id)
  
  if (isNaN(boletinId)) {
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

  const boletin = await getBoletinData(boletinId)

  if (!boletin) {
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
                No se pudo encontrar el boletín solicitado.
              </Typography>
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
          <BoletinSummaryWrapper boletin={boletin} />
        </Container>

        <Footer />
      </Box>
    </MuiThemeProvider>
  )
}

