import { useState, useEffect } from 'react'

export interface ProyectoIngresado {
  numero: number
  entidad: string
  municipio: string
  clave: string
  promovente: string
  proyecto: string
  modalidad: string
  fecha_ingreso: string
  descripcion?: string
}

export interface ResolutivoEmitido {
  numero: number
  entidad: string
  municipio: string
  clave: string
  promovente: string
  proyecto: string
  modalidad: string
  fecha_ingreso: string
  fecha_resolucion: string
  vigencia?: string
}

export interface GacetaAnalysis {
  url: string
  año: number
  fecha_publicacion: string | null
  palabras_clave_encontradas: string[]
  paginas: number[]
  secciones: string[]
  proyectos_ingresados: ProyectoIngresado[] | null
  resolutivos_emitidos: ResolutivoEmitido[] | null
  resumen: string | null
}

interface GacetasData {
  metadata: {
    created: string
    last_updated: string
    total_analyzed: number
    year_range: string
  }
  analyses: GacetaAnalysis[]
}

// Interfaz para gacetas procesadas (con fecha normalizada)
export interface ProcessedGacetaAnalysis extends Omit<GacetaAnalysis, 'fecha_publicacion'> {
  fecha_publicacion: string // Siempre un string después de normalización
}

// Interfaz para proyectos procesados con información de la gaceta
export interface ProyectoGacetaProcessed extends ProyectoIngresado {
  fecha_publicacion: string
  gaceta_url: string
}

// Interfaz para resolutivos procesados con vínculo al proyecto de ingreso
export interface ResolutivoGacetaProcessed extends ResolutivoEmitido {
  fecha_publicacion: string
  gaceta_url: string
  gaceta_ingreso_url: string | null // URL de la gaceta donde se ingresó el proyecto original
}

interface ProcessedGacetasData {
  stats: {
    totalGacetas: number
    totalAnalyses: number
    municipios: string[]
    giros: string[]
    tiposEstudio: string[]
    totalProyectos: number
    totalResolutivos: number
  }
  timeSeriesData: Array<{
    fecha: string
    gacetas: number
  }>
  gacetas: ProcessedGacetaAnalysis[]
  proyectos: ProyectoGacetaProcessed[]
  resolutivos: ResolutivoGacetaProcessed[]
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
        // Crear una fecha normalizada para cada gaceta (usar fecha_publicacion o año como fallback)
        const gacetasNormalizadas = jsonData.analyses
          .filter(a => a.resumen !== null)
          .map(gaceta => {
            // Normalizar fecha_publicacion: si es null, usar el 1 de enero del año
            let fechaNormalizada: string
            if (gaceta.fecha_publicacion) {
              fechaNormalizada = gaceta.fecha_publicacion
            } else {
              // Usar el año como fallback (1 de enero del año)
              fechaNormalizada = `${gaceta.año}-01-01`
            }
            return {
              ...gaceta,
              fecha_publicacion: fechaNormalizada
            } as ProcessedGacetaAnalysis
          })
          .sort((a, b) => {
            const dateA = new Date(a.fecha_publicacion).getTime()
            const dateB = new Date(b.fecha_publicacion).getTime()
            return dateB - dateA // Orden descendente (más reciente primero)
          })
        
        // Extraer municipios de proyectos_ingresados y resolutivos_emitidos
        const municipiosSet = new Set<string>()
        
        jsonData.analyses.forEach(gaceta => {
          // Extraer municipios de proyectos ingresados
          if (gaceta.proyectos_ingresados && Array.isArray(gaceta.proyectos_ingresados)) {
            gaceta.proyectos_ingresados.forEach(proyecto => {
              if (proyecto.municipio) {
                municipiosSet.add(proyecto.municipio)
              }
            })
          }
          
          // Extraer municipios de resolutivos emitidos
          if (gaceta.resolutivos_emitidos && Array.isArray(gaceta.resolutivos_emitidos)) {
            gaceta.resolutivos_emitidos.forEach(resolutivo => {
              if (resolutivo.municipio) {
                municipiosSet.add(resolutivo.municipio)
              }
            })
          }
        })

        // Crear datos de series temporales agrupados por mes
        const timeSeriesMap = new Map<string, number>()
        gacetasNormalizadas.forEach(gaceta => {
          const fecha = new Date(gaceta.fecha_publicacion)
          const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
          timeSeriesMap.set(mesAno, (timeSeriesMap.get(mesAno) || 0) + 1)
        })

        const timeSeriesData = Array.from(timeSeriesMap.entries())
          .map(([fecha, count]) => ({ fecha, gacetas: count }))
          .sort((a, b) => a.fecha.localeCompare(b.fecha))

        // Procesar todos los proyectos ingresados
        const proyectos: ProyectoGacetaProcessed[] = []
        jsonData.analyses.forEach(gaceta => {
          if (gaceta.proyectos_ingresados && Array.isArray(gaceta.proyectos_ingresados)) {
            const fechaNormalizada = gaceta.fecha_publicacion || `${gaceta.año}-01-01`
            gaceta.proyectos_ingresados.forEach(proyecto => {
              proyectos.push({
                ...proyecto,
                fecha_publicacion: fechaNormalizada,
                gaceta_url: gaceta.url
              })
            })
          }
        })

        // Procesar todos los resolutivos emitidos y vincularlos con proyectos
        const resolutivos: ResolutivoGacetaProcessed[] = []
        jsonData.analyses.forEach(gaceta => {
          if (gaceta.resolutivos_emitidos && Array.isArray(gaceta.resolutivos_emitidos)) {
            const fechaNormalizada = gaceta.fecha_publicacion || `${gaceta.año}-01-01`
            gaceta.resolutivos_emitidos.forEach(resolutivo => {
              // Buscar el proyecto correspondiente por clave
              const proyectoRelacionado = proyectos.find(p => p.clave === resolutivo.clave)
              
              resolutivos.push({
                ...resolutivo,
                fecha_publicacion: fechaNormalizada,
                gaceta_url: gaceta.url,
                gaceta_ingreso_url: proyectoRelacionado?.gaceta_url || null
              })
            })
          }
        })

        // Crear datos procesados
        const processed: ProcessedGacetasData = {
          stats: {
            totalGacetas: gacetasNormalizadas.length,
            totalAnalyses: jsonData.analyses.length,
            municipios: Array.from(municipiosSet).sort(),
            giros: [], // Las gacetas no tienen giros estructurados
            tiposEstudio: [], // Las gacetas no tienen tipos de estudio estructurados
            totalProyectos: proyectos.length,
            totalResolutivos: resolutivos.length
          },
          timeSeriesData,
          gacetas: gacetasNormalizadas,
          proyectos,
          resolutivos,
          metadata: {
            totalGacetas: gacetasNormalizadas.length,
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

