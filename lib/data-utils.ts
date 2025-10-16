import type { BoletinesData, Proyecto, Resolutivo } from "./types"

export function getStats(data: BoletinesData) {
  const totalBoletines = data.boletines.length
  const totalProyectos = data.boletines.reduce((sum, b) => sum + b.cantidad_ingresados, 0)
  const totalResolutivos = data.boletines.reduce((sum, b) => sum + b.cantidad_resolutivos, 0)

  const municipios = new Set<string>()
  const giros = new Set<string>()
  const tiposEstudio = new Set<string>()

  data.boletines.forEach((boletin) => {
    boletin.proyectos_ingresados.forEach((p) => {
      if (p.municipio) municipios.add(p.municipio)
      if (p.giro) giros.add(p.giro)
      if (p.tipo_estudio) tiposEstudio.add(p.tipo_estudio)
    })
  })

  return {
    totalBoletines,
    totalProyectos,
    totalResolutivos,
    municipios: Array.from(municipios).sort(),
    giros: Array.from(giros).sort(),
    tiposEstudio: Array.from(tiposEstudio).sort(),
  }
}

export function getTimeSeriesData(data: BoletinesData) {
  // Mapeo de números de mes a nombres en español
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const byMonth = data.boletines.reduce(
    (acc, boletin) => {
      // Extraer año y mes de fecha_publicacion
      if (!boletin.fecha_publicacion) {
        console.warn('Boletín sin fecha de publicación:', boletin)
        return acc
      }

      const fecha = new Date(boletin.fecha_publicacion)
      const año = fecha.getFullYear()
      const mes = fecha.getMonth() + 1 // getMonth() devuelve 0-11, necesitamos 1-12

      // Validar que la fecha sea válida
      if (isNaN(año) || isNaN(mes) || mes < 1 || mes > 12) {
        console.warn('Boletín con fecha inválida:', boletin.fecha_publicacion, boletin)
        return acc
      }

      const key = `${año}-${String(mes).padStart(2, "0")}`
      const fechaDisplay = `${año}-${meses[mes - 1]}`
      
      if (!acc[key]) {
        acc[key] = {
          fecha: fechaDisplay,
          proyectos: 0,
          resolutivos: 0,
        }
      }
      acc[key].proyectos += boletin.cantidad_ingresados || 0
      acc[key].resolutivos += boletin.cantidad_resolutivos || 0
      return acc
    },
    {} as Record<string, { fecha: string; proyectos: number; resolutivos: number }>,
  )

  const result = Object.values(byMonth).sort((a, b) => {
    // Extraer año y mes para ordenar correctamente
    const [añoA, mesA] = a.fecha.split('-')
    const [añoB, mesB] = b.fecha.split('-')
    const mesIndexA = meses.indexOf(mesA)
    const mesIndexB = meses.indexOf(mesB)
    
    if (añoA !== añoB) {
      return parseInt(añoA) - parseInt(añoB)
    }
    return mesIndexA - mesIndexB
  })

  // Debug: Log the processed data
  console.log('Time series data processed:', result)
  
  return result
}

// Función para normalizar expedientes (manejar inconsistencias como "20" vs "2025")
function normalizeExpediente(expediente: string): string {
  // Si el expediente termina en "-20", asumir que es "-2025"
  if (expediente.endsWith('-20')) {
    return expediente.replace('-20', '-2025')
  }
  return expediente
}

export function getAllProyectos(
  data: BoletinesData,
): (Proyecto & { fecha_publicacion: string; boletin_url: string })[] {
  const proyectos = data.boletines.flatMap((boletin) =>
    boletin.proyectos_ingresados.map((p) => ({
      ...p,
      expediente: normalizeExpediente(p.expediente), // Normalizar expediente
      fecha_publicacion: boletin.fecha_publicacion,
      boletin_url: boletin.url || boletin.filename,
    })),
  )
  
  // Debug: Check for the new project specifically
  const newProjectInData = proyectos.find(p => p.expediente === "SSMAA-DIRA-2789-2025")
  console.log("New project in getAllProyectos:", newProjectInData)
  console.log("Projects with date 13/10/2025 in getAllProyectos:", proyectos.filter(p => p.fecha_ingreso === "13/10/2025"))
  
  // Eliminar duplicados basado en expediente normalizado, manteniendo el más reciente
  const proyectosUnicos = proyectos.reduce((acc, proyecto) => {
    const existingIndex = acc.findIndex(p => p.expediente === proyecto.expediente)
    
    if (existingIndex === -1) {
      // No existe, agregarlo
      acc.push(proyecto)
    } else {
      // Ya existe, comparar fechas y mantener el más reciente
      const existingProject = acc[existingIndex]
      
      // Función para parsear fechas en formato DD/MM/YYYY
      const parseDate = (dateStr: string) => {
        // Si ya está en formato YYYY-MM-DD, usar directamente
        if (dateStr.includes('-')) {
          return new Date(dateStr)
        }
        // Si está en formato DD/MM/YYYY, convertir
        const parts = dateStr.split('/')
        if (parts.length === 3) {
          const day = parseInt(parts[0])
          const month = parseInt(parts[1]) - 1 // Mes es 0-indexado
          const year = parseInt(parts[2])
          return new Date(year, month, day)
        }
        // Fallback al parsing normal
        return new Date(dateStr)
      }
      
      const existingDate = parseDate(existingProject.fecha_publicacion)
      const newDate = parseDate(proyecto.fecha_publicacion)
      
      console.log(`Comparando fechas para ${proyecto.expediente}:`)
      console.log(`  Existente: ${existingProject.fecha_publicacion} → ${existingDate}`)
      console.log(`  Nuevo: ${proyecto.fecha_publicacion} → ${newDate}`)
      
      if (newDate > existingDate) {
        // El nuevo proyecto es más reciente, reemplazar
        acc[existingIndex] = proyecto
        console.log(`✅ Reemplazando proyecto duplicado ${proyecto.expediente}: ${existingProject.fecha_publicacion} → ${proyecto.fecha_publicacion}`)
      } else {
        console.log(`⏭️  Manteniendo proyecto existente (más reciente): ${existingProject.fecha_publicacion}`)
      }
    }
    
    return acc
  }, [] as typeof proyectos)
  
  // Debug: Check if new project survives deduplication
  const newProjectAfterDedup = proyectosUnicos.find(p => p.expediente === "SSMAA-DIRA-2789-2025")
  console.log("New project after deduplication:", newProjectAfterDedup)
  
  console.log(`Proyectos totales: ${proyectos.length}, Únicos: ${proyectosUnicos.length}`)
  
  return proyectosUnicos
}

export function getAllResolutivos(
  data: BoletinesData,
): (Resolutivo & { fecha_publicacion: string; boletin_url: string; coordenadas_x: number | null; coordenadas_y: number | null; boletin_ingreso_url: string | null })[] {
  // Primero obtener todos los proyectos con sus coordenadas
  const proyectosConCoordenadas = getAllProyectos(data)
  
  const resolutivosConCoordenadas = data.boletines.flatMap((boletin) =>
    boletin.resolutivos_emitidos.map((r) => {
      // Normalizar expediente
      const expedienteNormalizado = normalizeExpediente(r.expediente)
      
      // Buscar el proyecto correspondiente por expediente normalizado
      const proyectoRelacionado = proyectosConCoordenadas.find(p => p.expediente === expedienteNormalizado)
      
      const resolutivoConCoordenadas = {
        ...r,
        expediente: expedienteNormalizado, // Usar expediente normalizado
        fecha_publicacion: boletin.fecha_publicacion,
        boletin_url: boletin.url || boletin.filename,
        coordenadas_x: proyectoRelacionado?.coordenadas_x || null,
        coordenadas_y: proyectoRelacionado?.coordenadas_y || null,
        boletin_ingreso_url: proyectoRelacionado?.boletin_url || null,
      }
      
      // Debug: Log cuando se encuentra una relación
      if (proyectoRelacionado && proyectoRelacionado.coordenadas_x && proyectoRelacionado.coordenadas_y) {
        console.log(`Resolutivo ${expedienteNormalizado} relacionado con proyecto - Coordenadas: ${proyectoRelacionado.coordenadas_x}, ${proyectoRelacionado.coordenadas_y}`)
      } else if (proyectoRelacionado) {
        console.log(`Resolutivo ${expedienteNormalizado} relacionado con proyecto pero sin coordenadas`)
      } else {
        console.log(`Resolutivo ${expedienteNormalizado} SIN proyecto relacionado`)
      }
      
      return resolutivoConCoordenadas
    }),
  )
  
  // Eliminar duplicados basado en expediente
  const resolutivosUnicos = resolutivosConCoordenadas.filter((resolutivo, index, self) => 
    index === self.findIndex(r => r.expediente === resolutivo.expediente)
  )
  
  console.log(`Total resolutivos procesados: ${resolutivosConCoordenadas.length}`)
  console.log(`Resolutivos únicos: ${resolutivosUnicos.length}`)
  console.log(`Resolutivos con coordenadas: ${resolutivosUnicos.filter(r => r.coordenadas_x && r.coordenadas_y).length}`)
  
  return resolutivosUnicos
}

export function getDistributionByMunicipio(data: BoletinesData) {
  const distribution: Record<string, number> = {}

  data.boletines.forEach((boletin) => {
    boletin.proyectos_ingresados.forEach((p) => {
      if (p.municipio) {
        distribution[p.municipio] = (distribution[p.municipio] || 0) + 1
      }
    })
  })

  return Object.entries(distribution)
    .map(([municipio, count]) => ({ municipio, count }))
    .sort((a, b) => b.count - a.count)
}

export function getDistributionByGiro(data: BoletinesData) {
  const distribution: Record<string, number> = {}

  data.boletines.forEach((boletin) => {
    boletin.proyectos_ingresados.forEach((p) => {
      if (p.giro) {
        distribution[p.giro] = (distribution[p.giro] || 0) + 1
      }
    })
  })

  return Object.entries(distribution)
    .map(([giro, count]) => ({ giro, count }))
    .sort((a, b) => b.count - a.count)
}
