'use client'

import { Box, Typography, Link } from '@mui/material'
import { generarMapaEstaticoOSM, generarURLMapaCompleto, validarCoordenadasParaMapa } from '@/lib/map-static-generator'

interface SimpleMapProps {
  coordenadas_x: number | null
  coordenadas_y: number | null
  municipio: string
  width?: number
  height?: number
  showLink?: boolean
}

export function SimpleMap({ 
  coordenadas_x, 
  coordenadas_y, 
  municipio,
  width = 400,
  height = 300,
  showLink = true
}: SimpleMapProps) {
  // Validar coordenadas
  if (!coordenadas_x || !coordenadas_y) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          p: 2
        }}
      >
        <Typography variant="body2" color="error" textAlign="center">
          Coordenadas no disponibles
        </Typography>
        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
          Municipio: {municipio}
        </Typography>
      </Box>
    )
  }

  if (!validarCoordenadasParaMapa(coordenadas_x, coordenadas_y)) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          p: 2
        }}
      >
        <Typography variant="body2" color="error" textAlign="center">
          Coordenadas inválidas
        </Typography>
        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
          Municipio: {municipio}
        </Typography>
      </Box>
    )
  }

  // Generar mapa
  const mapResult = generarMapaEstaticoOSM(coordenadas_x, coordenadas_y, {
    width,
    height,
    zoom: 15,
    markerColor: 'red'
  })

  if (!mapResult.success) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          p: 2
        }}
      >
        <Typography variant="body2" color="error" textAlign="center">
          {mapResult.error || 'No se pudo cargar el mapa'}
        </Typography>
        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
          Municipio: {municipio}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width, height }}>
      {/* Mapa estático */}
      <Box
        component="img"
        src={mapResult.url}
        alt={`Mapa de ubicación en ${municipio}`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          cursor: 'pointer'
        }}
        onClick={() => {
          if (showLink) {
            const url = generarURLMapaCompleto(coordenadas_x, coordenadas_y)
            window.open(url, '_blank')
          }
        }}
      />
      
      {/* Información del mapa */}
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Ubicación en {municipio}
        </Typography>
        {showLink && (
          <Box sx={{ mt: 0.5 }}>
            <Link
              href={generarURLMapaCompleto(coordenadas_x, coordenadas_y)}
              target="_blank"
              rel="noopener noreferrer"
              variant="caption"
              sx={{ fontSize: '0.75rem' }}
            >
              Ver en OpenStreetMap
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  )
}
