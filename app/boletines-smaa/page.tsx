"use client"

import { useEffect, useState } from "react"
import { DashboardStats } from "@/components/dashboard-stats"
import { TimeSeriesChart } from "@/components/time-series-chart"
import { DistributionCharts } from "@/components/distribution-charts"
import { ProjectsTable } from "@/components/projects-table"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  getStats,
  getTimeSeriesData,
  getAllProyectos,
  getAllResolutivos,
  getDistributionByMunicipio,
  getDistributionByGiro,
} from "@/lib/data-utils"
import type { BoletinesData } from "@/lib/types"

export default function BoletinesSmaaPage() {
  const [data, setData] = useState<BoletinesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Usar URL absoluta del dominio personalizado
    const dataUrl = process.env.NODE_ENV === 'production' 
      ? 'https://adn-a.org/data/boletines.json'
      : '/data/boletines.json'
    
    fetch(dataUrl)
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Error loading data:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos del dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive">Error al cargar los datos</p>
      </div>
    )
  }

  const stats = getStats(data)
  const timeSeriesData = getTimeSeriesData(data)
  const proyectos = getAllProyectos(data)
  const resolutivos = getAllResolutivos(data)
  const municipiosData = getDistributionByMunicipio(data)
  const girosData = getDistributionByGiro(data)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Boletines Ambientales</h1>
              <p className="text-gray-600 mt-1">Secretaría de Medio Ambiente del Estado de Aguascalientes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col gap-8">
          {/* Stats Cards */}
          <ErrorBoundary>
            <DashboardStats
              totalBoletines={stats.totalBoletines}
              totalProyectos={stats.totalProyectos}
              totalResolutivos={stats.totalResolutivos}
              municipios={stats.municipios.length}
            />
          </ErrorBoundary>

          {/* Time Series Chart - Full Width */}
          <ErrorBoundary>
            <TimeSeriesChart data={timeSeriesData} />
          </ErrorBoundary>

          {/* Distribution Charts */}
          <ErrorBoundary>
            <DistributionCharts municipiosData={municipiosData} girosData={girosData} />
          </ErrorBoundary>

          {/* Projects Table */}
          <ErrorBoundary>
            <ProjectsTable
              proyectos={proyectos}
              resolutivos={resolutivos}
              municipios={stats.municipios}
              giros={stats.giros}
              tiposEstudio={stats.tiposEstudio}
            />
          </ErrorBoundary>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Datos de boletines ambientales publicados por la Secretaría de Medio Ambiente del Estado de Aguascalientes
            </p>
            <div className="mt-4 flex justify-center">
              <div className="text-xs text-gray-400">
                © 2024 Secretaría de Medio Ambiente del Estado de Aguascalientes
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
