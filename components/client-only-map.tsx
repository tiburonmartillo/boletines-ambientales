'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Link } from '@mui/material'
import { coordinateValidator } from '@/lib/coordinate-validator'

interface ClientOnlyMapProps {
  coordenadas_x: number | null
  coordenadas_y: number | null
  municipio: string
  width?: number
  height?: number
  showLink?: boolean
  staticMode?: boolean
}

// Función para convertir coordenadas a Lat/Long
function convertToLatLong(x: number | null, y: number | null): { lat: number; lng: number } | null {
  if (!x || !y) return null

  // Validar y corregir coordenadas
  const validationResult = coordinateValidator.processCoordinates(x, y);
  
  if (!validationResult.success) {
    console.warn('Coordenadas inválidas:', validationResult.error);
    return null;
  }

  const correctedX = validationResult.corrected.x;
  const correctedY = validationResult.corrected.y;

  // Si las coordenadas ya están en formato Lat/Lng, devolverlas directamente
  if (validationResult.type === 'latlng') {
    return { lat: correctedY, lng: correctedX };
  }

  // Si son coordenadas UTM, aplicar conversión completa
  if (validationResult.type === 'utm' || validationResult.type === 'utm14') {
    const zone = validationResult.type === 'utm14' ? 14 : 13;
    
    // Parámetros del elipsoide WGS84
    const sm_a = 6378137;
    const sm_b = 6356752.314;
    const UTMScaleFactor = 0.9996;
    
    // Función auxiliar para calcular la latitud del pie
    const calculateFootpointLatitude = (y: number): number => {
      const n = (sm_a - sm_b) / (sm_a + sm_b);
      const alpha_ = ((sm_a + sm_b) / 2) * (1 + (n ** 2) / 4) + (n ** 4) / 64;
      const y_ = y / alpha_;
      
      const beta_ = (3 * n / 2) + (-27 * (n ** 3) / 32) + (269 * (n ** 5) / 512);
      const gamma_ = (21 * (n ** 2) / 16) + (-55 * (n ** 4) / 32);
      const delta_ = (151 * (n ** 3) / 96) + (-417 * (n ** 5) / 128);
      const epsilon_ = (1097 * (n ** 4) / 512);
      
      return y_ + (beta_ * Math.sin(2 * y_)) + (gamma_ * Math.sin(4 * y_)) + 
             (delta_ * Math.sin(6 * y_)) + (epsilon_ * Math.sin(8 * y_));
    };
    
    // Ajustar coordenadas UTM
    let x = correctedX - 500000;
    x = x / UTMScaleFactor;
    const y = correctedY / UTMScaleFactor;
    
    // Calcular meridiano central de la zona
    const lambda0 = ((-183 + (zone * 6)) / 180) * Math.PI;
    
    // Calcular latitud del pie
    const phif = calculateFootpointLatitude(y);
    
    // Precalcular valores auxiliares
    const ep2 = (sm_a ** 2 - sm_b ** 2) / (sm_b ** 2);
    const cf = Math.cos(phif);
    const nuf2 = ep2 * (cf ** 2);
    const Nf = (sm_a ** 2) / (sm_b * Math.sqrt(1 + nuf2));
    
    const tf = Math.tan(phif);
    const tf2 = tf * tf;
    const tf4 = tf2 * tf2;
    
    // Calcular coeficientes fraccionarios
    let Nfpow = Nf;
    const x1frac = 1 / (Nfpow * cf);
    
    Nfpow = Nfpow * Nf;
    const x2frac = tf / (2 * Nfpow);
    
    Nfpow = Nfpow * Nf;
    const x3frac = 1 / (6 * Nfpow * cf);
    
    Nfpow = Nfpow * Nf;
    const x4frac = tf / (24 * Nfpow);
    
    Nfpow = Nfpow * Nf;
    const x5frac = 1 / (120 * Nfpow * cf);
    
    Nfpow = Nfpow * Nf;
    const x6frac = tf / (720 * Nfpow);
    
    Nfpow = Nfpow * Nf;
    const x7frac = 1 / (5040 * Nfpow * cf);
    
    Nfpow = Nfpow * Nf;
    const x8frac = tf / (40320 * Nfpow);
    
    // Calcular coeficientes polinomiales
    const x2poly = -1 - nuf2;
    const x3poly = -1 - 2 * tf2 - nuf2;
    const x4poly = 5 + 3 * tf2 + 6 * nuf2 - 6 * tf2 * nuf2 - 3 * (nuf2 * nuf2) - 9 * tf2 * (nuf2 * nuf2);
    const x5poly = 5 + 28 * tf2 + 24 * tf4 + 6 * nuf2 + 8 * tf2 * nuf2;
    const x6poly = -61 - 90 * tf2 - 45 * tf4 - 107 * nuf2 + 162 * tf2 * nuf2;
    const x7poly = -61 - 662 * tf2 - 1320 * tf4 - 720 * (tf4 * tf2);
    const x8poly = 1385 + 3633 * tf2 + 4095 * tf4 + 1575 * (tf4 * tf2);
    
    // Calcular latitud y longitud
    const lat = phif + x2frac * x2poly * (x * x) + x4frac * x4poly * x ** 4 + 
                x6frac * x6poly * x ** 6 + x8frac * x8poly * x ** 8;
    const lng = lambda0 + x1frac * x + x3frac * x3poly * x ** 3 + 
                x5frac * x5poly * x ** 5 + x7frac * x7poly * x ** 7;
    
    // Convertir de radianes a grados
    const latDegrees = (lat / Math.PI) * 180;
    const lngDegrees = (lng / Math.PI) * 180;
    
    return { lat: latDegrees, lng: lngDegrees };
  }

  return null;
}

// Función para generar URL de mapa estático usando OpenStreetMap
function generateStaticMapUrl(lat: number, lng: number, width: number = 400, height: number = 300): string {
  return `https://staticmap.openstreetmap.fr/staticmap.php?center=${lat},${lng}&zoom=15&size=${width}x${height}&markers=${lat},${lng},red&maptype=mapnik&format=png`
}

// Función para generar URL de OpenStreetMap completo
function generateOpenStreetMapUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`
}

export function ClientOnlyMap({ 
  coordenadas_x, 
  coordenadas_y, 
  municipio,
  width = 400,
  height = 300,
  showLink = true,
  staticMode = false
}: ClientOnlyMapProps) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('ClientOnlyMap: Montando componente con coordenadas:', { coordenadas_x, coordenadas_y, municipio })
    setMounted(true)
    // Convertir coordenadas solo en el cliente
    const convertedCoords = convertToLatLong(coordenadas_x, coordenadas_y)
    console.log('ClientOnlyMap: Coordenadas convertidas:', convertedCoords)
    setCoords(convertedCoords)
  }, [coordenadas_x, coordenadas_y, municipio])

  // Si no está montado, mostrar placeholder consistente
  if (!mounted) {
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
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Cargando mapa...
        </Typography>
        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
          Municipio: {municipio}
        </Typography>
      </Box>
    )
  }

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
        <Typography variant="body2" color="text.secondary" textAlign="center">
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

  console.log('ClientOnlyMap: Generando mapa con URL:', mapUrl)

  return (
    <Box sx={{ width, height }}>
      {/* Usar imagen estática por defecto para mejor compatibilidad con PDF */}
      <Box
        component="img"
        src={mapUrl}
        alt={`Mapa de ubicación en ${municipio}`}
        sx={{
          width: '100%',
          height: '100%',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          objectFit: 'cover',
          cursor: 'pointer',
          backgroundColor: '#f5f5f5',
          '&:hover': {
            opacity: 0.9
          }
        }}
        onClick={() => {
          if (showLink) {
            window.open(osmUrl, '_blank')
          }
        }}
        title={`Mapa de ubicación en ${municipio} - Click para ver en OpenStreetMap`}
        onLoad={() => {
          console.log('ClientOnlyMap: Mapa cargado exitosamente:', mapUrl)
        }}
        onError={(e) => {
          console.error('ClientOnlyMap: Error cargando mapa:', mapUrl, e)
          // Si falla la imagen, mostrar un placeholder
          const target = e.target as HTMLImageElement
          console.log('ClientOnlyMap: Mostrando placeholder...')
          target.src = `data:image/svg+xml;base64,${btoa(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#f0f0f0" stroke="#ccc" stroke-width="1"/>
              <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="#666">
                Mapa no disponible
              </text>
              <text x="50%" y="60%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="#999">
                ${municipio}
              </text>
            </svg>
          `)}`
        }}
      />
      
      {/* Información del mapa - Solo mostrar si showLink es true */}
      {showLink && (
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Ubicación en {municipio}
          </Typography>
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
        </Box>
      )}
    </Box>
  )
}
