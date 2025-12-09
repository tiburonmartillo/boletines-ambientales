import { useState, useEffect } from 'react'

// Interfaz para un registro individual en analisis_completo.registros
export interface RegistroGaceta {
  id: string
  clave_proyecto: string
  tipo_registro: string
  seccion_documento: string
  entidad: string
  municipio: string
  proyecto_nombre: string
  promovente: string
  modalidad: string
  tipo_proyecto: string
  fecha_ingreso: string | null
  fecha_resolucion: string | null
  estatus: string | null
  vigencia: {
    construccion_anios: number | null
    operacion_anios: number | null
    texto_completo: string | null
  } | null
  superficie: {
    total_m2: number | null
    total_hectareas: number | null
    cambio_uso_suelo_m2: number | null
    cambio_uso_suelo_hectareas: number | null
  } | null
  vegetacion: {
    tipo: string | null
    remocion: string | null
  } | null
  ubicacion_especifica: string | null
  descripcion: string | null
  cambio_uso_suelo: boolean | null
  areas_forestales: boolean | null
  observaciones: string | null
  id_db: number
  proyecto_ingresado_id: number | null
  resolutivos_ids: number[]
  gaceta_id: string
  semarnat_data?: any | null // Datos del API de SEMARNAT (search-files)
  semarnat_historial?: any | null // Historial del API de SEMARNAT (search-historial-bitacora)
}

export interface ProyectoIngresado {
  id_db: number
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
  id_db: number
  entidad: string
  municipio: string
  clave: string
  promovente: string
  proyecto: string
  modalidad: string
  fecha_ingreso: string
  fecha_resolucion: string
  vigencia?: string
  proyecto_ingresado_id: number | null
}

export interface AnalisisCompleto {
  gaceta: {
    numero: string
    fecha_publicacion: string
    anio: number
  }
  resumen: {
    total_registros: number
    proyectos_ingresados: number
    resolutivos_emitidos: number
    tramites_unificados: number
    consultas_publicas: number
    hectareas_totales: number
  }
  registros: RegistroGaceta[]
}

export interface GacetaAnalysis {
  url: string
  año: number
  gaceta_id: string
  fecha_publicacion: string | null
  palabras_clave_encontradas: string[]
  paginas: number[]
  secciones: string[] | null
  analisis_completo: AnalisisCompleto | null
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
  gaceta_id: string
  resolutivos_ids?: number[] // IDs de resolutivos relacionados
}

// Interfaz para resolutivos procesados con vínculo al proyecto de ingreso
export interface ResolutivoGacetaProcessed extends ResolutivoEmitido {
  fecha_publicacion: string
  gaceta_url: string
  gaceta_id: string
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
    let isMounted = true
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const dataUrl = `/data/gacetas_semarnat_analizadas.json?v=static`

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 segundos

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

        if (!isMounted) return

        if (!jsonData.analyses || !Array.isArray(jsonData.analyses)) {
          throw new Error('Invalid data structure: missing analyses array')
        }

        setData(jsonData)

        // Procesar datos de gacetas y ordenar por fecha (más reciente primero)
        // Crear una fecha normalizada para cada gaceta (usar fecha_publicacion o año como fallback)
        const gacetasNormalizadas = jsonData.analyses
          .filter(a => a.resumen !== null && a.analisis_completo !== null)
          .map(gaceta => {
            // Normalizar fecha_publicacion: si es null, usar el 1 de enero del año
            let fechaNormalizada: string
            if (gaceta.fecha_publicacion) {
              fechaNormalizada = gaceta.fecha_publicacion
            } else if (gaceta.analisis_completo?.gaceta?.fecha_publicacion) {
              fechaNormalizada = gaceta.analisis_completo.gaceta.fecha_publicacion
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
        
        // Crear un mapa de id_db a registros para vincular proyectos con resolutivos
        const registrosPorId = new Map<number, { registro: RegistroGaceta; gacetaUrl: string; fechaPublicacion: string }>()
        
        // Primera pasada: recolectar todos los registros y crear el mapa
        jsonData.analyses.forEach(gaceta => {
          if (gaceta.analisis_completo?.registros) {
            const fechaNormalizada = gaceta.fecha_publicacion || 
              gaceta.analisis_completo.gaceta?.fecha_publicacion || 
              `${gaceta.año}-01-01`
            
            gaceta.analisis_completo.registros.forEach(registro => {
              registrosPorId.set(registro.id_db, {
                registro,
                gacetaUrl: gaceta.url,
                fechaPublicacion: fechaNormalizada
              })
            })
          }
        })

        // Extraer municipios de todos los registros
        const municipiosSet = new Set<string>()
        registrosPorId.forEach(({ registro }) => {
          if (registro.municipio) {
            municipiosSet.add(registro.municipio)
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

        // Procesar todos los proyectos ingresados desde analisis_completo.registros
        const proyectos: ProyectoGacetaProcessed[] = []
        jsonData.analyses.forEach(gaceta => {
          if (gaceta.analisis_completo?.registros) {
            const fechaNormalizada = gaceta.fecha_publicacion || 
              gaceta.analisis_completo.gaceta?.fecha_publicacion || 
              `${gaceta.año}-01-01`
            
            gaceta.analisis_completo.registros.forEach(registro => {
              // Incluir proyectos ingresados y trámites unificados en la tabla de proyectos
              if (registro.tipo_registro === 'proyecto_ingresado' || registro.tipo_registro === 'tramite_unificado') {
                proyectos.push({
                  id_db: registro.id_db,
                  entidad: registro.entidad,
                  municipio: registro.municipio,
                  clave: registro.clave_proyecto,
                  promovente: registro.promovente,
                  proyecto: registro.proyecto_nombre,
                  modalidad: registro.modalidad,
                  fecha_ingreso: registro.fecha_ingreso || '',
                  descripcion: registro.descripcion || undefined,
                  fecha_publicacion: fechaNormalizada,
                  gaceta_url: gaceta.url,
                  gaceta_id: gaceta.gaceta_id,
                  resolutivos_ids: registro.resolutivos_ids || []
                })
              }
            })
          }
        })

        // Procesar todos los resolutivos emitidos y vincularlos con proyectos
        const resolutivos: ResolutivoGacetaProcessed[] = []
        jsonData.analyses.forEach(gaceta => {
          if (gaceta.analisis_completo?.registros) {
            const fechaNormalizada = gaceta.fecha_publicacion || 
              gaceta.analisis_completo.gaceta?.fecha_publicacion || 
              `${gaceta.año}-01-01`
            
            gaceta.analisis_completo.registros.forEach(registro => {
              if (registro.tipo_registro === 'resolutivo_emitido') {
                // Buscar el proyecto relacionado usando proyecto_ingresado_id primero, luego por clave
                let proyectoRelacionado: ProyectoGacetaProcessed | null = null
                let gacetaIngresoUrl: string | null = null
                
                if (registro.proyecto_ingresado_id) {
                  // Primero buscar por id_db en proyectos ya procesados
                  proyectoRelacionado = proyectos.find(p => p.id_db === registro.proyecto_ingresado_id) || null
                  
                  // Si no se encontró en proyectos procesados, buscar en el mapa de registros
                  if (!proyectoRelacionado) {
                    const registroProyecto = registrosPorId.get(registro.proyecto_ingresado_id)
                    if (registroProyecto && registroProyecto.registro.tipo_registro === 'proyecto_ingresado') {
                      gacetaIngresoUrl = registroProyecto.gacetaUrl
                    }
                  } else {
                    gacetaIngresoUrl = proyectoRelacionado.gaceta_url
                  }
                }
                
                // Si no se encontró por id_db, intentar por clave_proyecto
                if (!proyectoRelacionado && !gacetaIngresoUrl) {
                  proyectoRelacionado = proyectos.find(p => p.clave === registro.clave_proyecto) || null
                  if (proyectoRelacionado) {
                    gacetaIngresoUrl = proyectoRelacionado.gaceta_url
                  }
                }
                
                resolutivos.push({
                  id_db: registro.id_db,
                  entidad: registro.entidad,
                  municipio: registro.municipio,
                  clave: registro.clave_proyecto,
                  promovente: registro.promovente,
                  proyecto: registro.proyecto_nombre,
                  modalidad: registro.modalidad,
                  fecha_ingreso: registro.fecha_ingreso || '',
                  fecha_resolucion: registro.fecha_resolucion || '',
                  vigencia: registro.vigencia?.texto_completo || undefined,
                  proyecto_ingresado_id: registro.proyecto_ingresado_id,
                  fecha_publicacion: fechaNormalizada,
                  gaceta_url: gaceta.url,
                  gaceta_id: gaceta.gaceta_id,
                  gaceta_ingreso_url: gacetaIngresoUrl
                })
              }
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

        console.log('✅ Datos procesados exitosamente:', {
          totalGacetas: processed.stats.totalGacetas,
          totalProyectos: processed.stats.totalProyectos,
          totalResolutivos: processed.stats.totalResolutivos
        })
        
        if (!isMounted) return
        
        setProcessedData(processed)
        setLoading(false)
        
      } catch (err) {
        if (!isMounted) return
        
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
    
    return () => {
      isMounted = false
    }
  }, [])

  return {
    data,
    processedData,
    loading,
    error
  }
}

