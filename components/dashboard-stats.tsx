import { Card } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatsCard({ title, value, description, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <span className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          )}
        </div>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </div>
  )
}

interface DashboardStatsProps {
  totalBoletines: number
  totalProyectos: number
  totalResolutivos: number
  municipios: number
}

export function DashboardStats({ totalBoletines, totalProyectos, totalResolutivos, municipios }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Total Boletines" value={totalBoletines.toLocaleString()} description="Boletines disponibles publicados" />
      <StatsCard
        title="Proyectos Ingresados"
        value={totalProyectos.toLocaleString()}
        description="Proyectos en evaluación"
      />
      <StatsCard
        title="Resolutivos Emitidos"
        value={totalResolutivos.toLocaleString()}
        description="Resoluciones publicadas"
      />
      <StatsCard title="Municipios" value={municipios} description="Municipios con proyectos" />
    </div>
  )
}
