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
    <div className="bg-white rounded-xl border border-[#1E3A8A]/10  p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3">
        <p className="text-xs sm:text-sm font-medium text-[#000000]/70">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#000000]">{value}</h3>
          {trend && (
            <span className={`text-xs sm:text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          )}
        </div>
        {description && <p className="text-xs text-[#000000]/60">{description}</p>}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
