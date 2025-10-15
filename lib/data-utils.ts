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
  const byMonth = data.boletines.reduce(
    (acc, boletin) => {
      const key = `${boletin.año}-${String(boletin.mes).padStart(2, "0")}`
      if (!acc[key]) {
        acc[key] = {
          fecha: key,
          proyectos: 0,
          resolutivos: 0,
        }
      }
      acc[key].proyectos += boletin.cantidad_ingresados
      acc[key].resolutivos += boletin.cantidad_resolutivos
      return acc
    },
    {} as Record<string, { fecha: string; proyectos: number; resolutivos: number }>,
  )

  return Object.values(byMonth).sort((a, b) => a.fecha.localeCompare(b.fecha))
}

export function getAllProyectos(
  data: BoletinesData,
): (Proyecto & { fecha_publicacion: string; boletin_url: string })[] {
  return data.boletines.flatMap((boletin) =>
    boletin.proyectos_ingresados.map((p) => ({
      ...p,
      fecha_publicacion: boletin.fecha_publicacion,
      boletin_url: boletin.url || boletin.filename,
    })),
  )
}

export function getAllResolutivos(
  data: BoletinesData,
): (Resolutivo & { fecha_publicacion: string; boletin_url: string })[] {
  return data.boletines.flatMap((boletin) =>
    boletin.resolutivos_emitidos.map((r) => ({
      ...r,
      fecha_publicacion: boletin.fecha_publicacion,
      boletin_url: boletin.url || boletin.filename,
    })),
  )
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
