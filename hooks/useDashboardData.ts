import { useState, useEffect } from 'react'
import type { BoletinesData } from '@/lib/types'
import {
  getStats,
  getTimeSeriesData,
  getAllProyectos,
  getAllResolutivos,
  getDistributionByMunicipio,
  getDistributionByGiro,
} from '@/lib/data-utils'

// Función para obtener la fecha del boletín más reciente
function getLatestBoletinDate(boletines: any[]): string {
  if (!boletines || boletines.length === 0) {
    return new Date().toISOString()
  }
  
  const latestBoletin = boletines.reduce((latest, current) => {
    const latestDate = new Date(latest.fecha_publicacion)
    const currentDate = new Date(current.fecha_publicacion)
    return currentDate > latestDate ? current : latest
  })
  
  return latestBoletin.fecha_publicacion
}

interface ProcessedData {
  stats: any
  timeSeriesData: any
  municipiosData: any
  girosData: any
  proyectos: any
  resolutivos: any
  metadata: {
    totalBoletines: number
    totalProyectos: number
    totalResolutivos: number
    lastUpdated: string
  }
}

export function useDashboardData() {
  const [data, setData] = useState<BoletinesData | null>(null)
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos desde el archivo JSON estático
        const dataUrl = `/data/boletines.json?v=static`

        // Crear un AbortController para manejar timeouts
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minutos

        const response = await fetch(dataUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const jsonData: BoletinesData = await response.json()

        // Validar estructura de datos
        if (!jsonData.boletines || !Array.isArray(jsonData.boletines)) {
          throw new Error('Invalid data structure: missing boletines array')
        }

        setData(jsonData)

        // Procesar datos usando las funciones de utilidad
        const stats = getStats(jsonData)
        const timeSeriesData = getTimeSeriesData(jsonData)
        const municipiosData = getDistributionByMunicipio(jsonData)
        const girosData = getDistributionByGiro(jsonData)
        const proyectos = getAllProyectos(jsonData)
        const resolutivos = getAllResolutivos(jsonData)

        // Crear datos procesados
        const processed: ProcessedData = {
          stats,
          timeSeriesData,
          municipiosData,
          girosData,
          proyectos,
          resolutivos,
          metadata: {
            totalBoletines: jsonData.boletines.length,
            totalProyectos: proyectos.length,
            totalResolutivos: resolutivos.length,
            lastUpdated: getLatestBoletinDate(jsonData.boletines)
          }
        }

        setProcessedData(processed)
        setLoading(false)
        
      } catch (err) {
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            setError("Timeout: Los datos tardaron demasiado en cargar. El archivo es muy grande.")
          } else if (err.message.includes('Failed to fetch')) {
            setError("Error de conexión: No se pudo cargar el archivo de datos.")
          } else {
            setError(`Error al cargar los datos: ${err.message}`)
          }
        } else {
          setError("Error desconocido al cargar los datos.")
        }
        
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return {
    data,
    processedData,
    loading,
    error
  }
}
