import React from 'react'
import { Box, Container, Typography, Alert, Breadcrumbs, Link } from '@mui/material'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MuiThemeProvider } from '@/components/mui-theme-provider'
import { BoletinSummaryWrapper } from '@/components/boletin-summary-wrapper'
import { Boletin } from '@/lib/types'
import { redirect } from 'next/navigation'

interface ResumenBoletinPageProps {
  params: Promise<{ id: string }>
}

// Función para generar parámetros estáticos
export async function generateStaticParams() {
  try {
    // Cargar datos de boletines para generar rutas estáticas
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/data/boletines.json`)
    const data = await response.json()
    
    // Generar parámetros para los primeros 50 boletines más recientes
    const recentBoletines = data.boletines
      .sort((a: any, b: any) => new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime())
      .slice(0, 50)
    
    return recentBoletines.map((boletin: any) => ({
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
      { id: '449' }
    ]
  }
}

// Función para obtener datos del boletín en el servidor
async function getBoletinData(boletinId: number): Promise<Boletin | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/data/boletines.json`)
    const data = await response.json()
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

  // Redirigir a nuestro archivo estático usando redirect del servidor
  redirect(`/static-resumen/${boletinId}/`)
}

