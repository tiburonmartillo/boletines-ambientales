import { useState, useEffect } from 'react'

interface GacetaAnalysis {
  url: string
  fecha_publicacion: string
  palabras_clave_encontradas: string[]
  paginas: number[]
  resumen: string | null
}

interface GacetasData {
  metadata: {
    created: string
    last_updated: string
    total_analyzed: number
    year: number
    combined: boolean
  }
  analyses: GacetaAnalysis[]
}

interface ProcessedGacetasData {
  stats: {
    totalGacetas: number
    totalAnalyses: number
    municipios: string[]
    giros: string[]
    tiposEstudio: string[]
  }
  timeSeriesData: Array<{
    fecha: string
    gacetas: number
  }>
  gacetas: GacetaAnalysis[]
  metadata: {
    totalGacetas: number
    lastUpdated: string
  }
}

export function useGacetasData() {
  const [data, setData] = useState<GacetasData | null>(null)
  const [processedData, setProcessedData] = useState<ProcessedGacetasData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const dataUrl = `/data/gacetas_semarnat_analizadas.json?v=static`

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos

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

        const jsonData: GacetasData = await response.json()

        if (!jsonData.analyses || !Array.isArray(jsonData.analyses)) {
          throw new Error('Invalid data structure: missing analyses array')
        }

        setData(jsonData)

        // Procesar datos de gacetas y ordenar por fecha (más reciente primero)
        const gacetas = jsonData.analyses
          .filter(a => a.resumen !== null)
          .sort((a, b) => {
            const dateA = new Date(a.fecha_publicacion).getTime()
            const dateB = new Date(b.fecha_publicacion).getTime()
            return dateB - dateA // Orden descendente (más reciente primero)
          })
        
        // Extraer municipios mencionados en los resúmenes
        const municipiosSet = new Set<string>()
        const municipiosComunes = [
          'Aguascalientes', 'Calvillo', 'Jesús María', 'San Francisco de los Romo',
          'San José de Gracia', 'El Llano', 'Rincón de Romo', 'Asientos', 'Cosío',
          'Pabellón de Arteaga', 'Tepezalá'
        ]
        
        gacetas.forEach(gaceta => {
          if (gaceta.resumen) {
            municipiosComunes.forEach(municipio => {
              if (gaceta.resumen!.toLowerCase().includes(municipio.toLowerCase())) {
                municipiosSet.add(municipio)
              }
            })
          }
        })

        // Crear datos de series temporales agrupados por mes
        const timeSeriesMap = new Map<string, number>()
        gacetas.forEach(gaceta => {
          const fecha = new Date(gaceta.fecha_publicacion)
          const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
          timeSeriesMap.set(mesAno, (timeSeriesMap.get(mesAno) || 0) + 1)
        })

        const timeSeriesData = Array.from(timeSeriesMap.entries())
          .map(([fecha, count]) => ({ fecha, gacetas: count }))
          .sort((a, b) => a.fecha.localeCompare(b.fecha))

        // Crear datos procesados
        const processed: ProcessedGacetasData = {
          stats: {
            totalGacetas: gacetas.length,
            totalAnalyses: jsonData.analyses.length,
            municipios: Array.from(municipiosSet),
            giros: [], // Las gacetas no tienen giros estructurados
            tiposEstudio: [] // Las gacetas no tienen tipos de estudio estructurados
          },
          timeSeriesData,
          gacetas,
          metadata: {
            totalGacetas: gacetas.length,
            lastUpdated: jsonData.metadata.last_updated
          }
        }

        setProcessedData(processed)
        setLoading(false)
        
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            setError("Timeout: Los datos tardaron demasiado en cargar.")
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

