'use client'

import { Box, Typography, Link } from '@mui/material'
import { coordinateValidator } from '@/lib/coordinate-validator'

interface SimpleMapProps {
  coordenadas_x: number | null
  coordenadas_y: number | null
  municipio: string
  width?: number
  height?: number
  showLink?: boolean
}

// Función para convertir coordenadas a Lat/Long usando el mismo validador que la modal
function convertToLatLong(x: number | null, y: number | null): { lat: number; lng: number } | null {
  if (!x || !y) return null

  // Validar y corregir coordenadas usando el mismo validador que la modal
  const validationResult = coordinateValidator.processCoordinates(x, y);
  
  if (!validationResult.success) {
    console.warn('Coordenadas inválidas:', validationResult.error);
    return null;
  }

  // Usar coordenadas corregidas
  const correctedX = validationResult.corrected.x;
  const correctedY = validationResult.corrected.y;

  // Si las coordenadas fueron corregidas, loggear la corrección
  if (validationResult.wasCorrected) {
    console.log(`✅ Coordenadas UTM corregidas (ambos dígitos faltantes): ${x}, ${y} → ${correctedX}, ${correctedY}`);
  }

  // Si las coordenadas ya están en formato Lat/Lng, devolverlas directamente
  if (validationResult.type === 'latlng') {
    return { lat: correctedY, lng: correctedX };
  }

  // Si son coordenadas UTM, aplicar conversión (simplificada para mapa estático)
  if (validationResult.type === 'utm' || validationResult.type === 'utm14') {
    // Para mapa estático, usar una conversión simple aproximada
    // Esto es una aproximación rápida para mostrar la ubicación
    const zone = validationResult.type === 'utm14' ? 14 : 13;
    
    // Conversión aproximada UTM a Lat/Lng para zona 13/14 México
    const lat = correctedY / 111000; // Aproximación simple
    const lng = correctedX / 111000; // Aproximación simple
    
    return { lat, lng };
  }

  return null;
}

// Función para generar URL de mapa estático usando OpenStreetMap
function generateStaticMapUrl(lat: number, lng: number, width: number = 400, height: number = 300): string {
  const baseUrl = 'https://staticmap.openstreetmap.de/staticmap.php'
  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: '15',
    size: `${width}x${height}`,
    markers: `${lat},${lng},red`,
    maptype: 'mapnik'
  })
  
  return `${baseUrl}?${params.toString()}`
}

// Función para generar URL de OpenStreetMap completo
function generateOpenStreetMapUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`
}

export function SimpleMap({ 
  coordenadas_x, 
  coordenadas_y, 
  municipio,
  width = 400,
  height = 300,
  showLink = true
}: SimpleMapProps) {
  // Convertir coordenadas usando el mismo sistema que la modal
  const coords = convertToLatLong(coordenadas_x, coordenadas_y)

  // Si no se pudieron convertir las coordenadas
  if (!coords) {
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

  const { lat, lng } = coords
  const mapUrl = generateStaticMapUrl(lat, lng, width, height)
  const osmUrl = generateOpenStreetMapUrl(lat, lng)

  return (
    <Box sx={{ width, height }}>
      {/* Mapa estático */}
      <Box
        component="img"
        src={mapUrl}
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
            window.open(osmUrl, '_blank')
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
              href={osmUrl}
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
