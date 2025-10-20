"use client"

import { useState, useEffect } from "react"
import { AirbnbDashboard } from "@/components/airbnb-dashboard"
import { getStats, getAllProyectos, getAllResolutivos } from "@/lib/data-utils"
import type { BoletinesData } from "@/lib/types"

export default function AirbnbDashboardPage() {
  const [data, setData] = useState<BoletinesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Add cache busting
        const timestamp = new Date().getTime()
        const dataUrl = `/data/boletines.json?t=${timestamp}`
        
        console.log('Fetching data from:', dataUrl)
        const response = await fetch(dataUrl)
        
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`)
        }
        
        const jsonData = await response.json()
        console.log('Data loaded successfully:', {
          boletines: jsonData.boletines?.length || 0,
          timestamp: new Date().toISOString()
        })
        
        setData(jsonData)
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-2">Error al cargar los datos</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No hay datos disponibles</p>
        </div>
      </div>
    )
  }

  const proyectos = getAllProyectos(data)
  const resolutivos = getAllResolutivos(data)
  const stats = getStats(data)

  console.log('Dashboard data prepared:', {
    proyectos: proyectos.length,
    resolutivos: resolutivos.length,
    municipios: stats.municipios.length,
    giros: stats.giros.length,
    tiposEstudio: stats.tiposEstudio.length
  })

  return (
    <AirbnbDashboard
      proyectos={proyectos}
      resolutivos={resolutivos}
      municipios={stats.municipios}
      giros={stats.giros}
      tiposEstudio={stats.tiposEstudio}
    />
  )
}
