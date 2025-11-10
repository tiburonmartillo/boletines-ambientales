'use client'

import { useState, useEffect } from 'react'
import { Box, Text, Link, Callout, Flex } from '@radix-ui/themes'
import { generarMapaEstaticoOSM, generarURLMapaCompleto, validarCoordenadasParaMapa } from '@/lib/map-static-generator'

interface MapStaticProps {
  coordenadas_x: number | null
  coordenadas_y: number | null
  municipio: string
  width?: number
  height?: number
  showLink?: boolean
}

export function BoletinSummaryMap({ 
  coordenadas_x, 
  coordenadas_y, 
  municipio,
  width = 400,
  height = 300,
  showLink = true
}: MapStaticProps) {
  const [mapData, setMapData] = useState<{
    url: string
    lat: number
    lng: number
    success: boolean
    error?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMap = () => {
      if (!coordenadas_x || !coordenadas_y) {
        setError('Coordenadas no disponibles')
        setLoading(false)
        return
      }

      if (!validarCoordenadasParaMapa(coordenadas_x, coordenadas_y)) {
        setError('Coordenadas inválidas')
        setLoading(false)
        return
      }

      try {
        const mapResult = generarMapaEstaticoOSM(coordenadas_x, coordenadas_y, {
          width,
          height,
          zoom: 15,
          markerColor: 'red'
        })

        if (mapResult.success) {
          setMapData(mapResult)
        } else {
          setError(mapResult.error || 'Error al generar el mapa')
        }
      } catch (err) {
        setError('Error al cargar el mapa')
      } finally {
        setLoading(false)
      }
    }

    // Usar setTimeout para asegurar que se ejecute después del render
    const timeoutId = setTimeout(loadMap, 100)
    return () => clearTimeout(timeoutId)
  }, [coordenadas_x, coordenadas_y, width, height])

  if (loading) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{
          width,
          height,
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: 'var(--radius-3)'
        }}
      >
        <Text size="2" color="gray">
          Cargando mapa...
        </Text>
      </Flex>
    )
  }

  if (error || !mapData?.success) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        style={{
          width,
          height,
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: 'var(--radius-3)',
          padding: 'var(--space-3)'
        }}
      >
        <Text size="2" color="red" style={{ textAlign: 'center' }}>
          {error || 'No se pudo cargar el mapa'}
        </Text>
        <Text size="1" color="gray" style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
          Municipio: {municipio}
        </Text>
      </Flex>
    )
  }

  return (
    <Box style={{ width, height }}>
      {/* Mapa estático */}
      <img
        src={mapData.url}
        alt={`Mapa de ubicación en ${municipio}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          border: '1px solid #e0e0e0',
          borderRadius: 'var(--radius-3)',
          cursor: 'pointer'
        }}
        onClick={() => {
          if (showLink && mapData.success) {
            const url = generarURLMapaCompleto(coordenadas_x!, coordenadas_y!)
            window.open(url, '_blank')
          }
        }}
      />
      
      {/* Información del mapa */}
      <Flex direction="column" align="center" gap="1" style={{ marginTop: 'var(--space-2)' }}>
        <Text size="1" color="gray">
          Ubicación en {municipio}
        </Text>
        {showLink && mapData.success && (
          <Link
            href={generarURLMapaCompleto(coordenadas_x!, coordenadas_y!)}
            target="_blank"
            rel="noopener noreferrer"
            size="1"
          >
            Ver en OpenStreetMap
          </Link>
        )}
      </Flex>
    </Box>
  )
}
