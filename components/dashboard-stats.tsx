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
    <Card className="p-6 bg-card border-border">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {trend && (
            <span className={`text-sm font-medium ${trend.isPositive ? "text-chart-2" : "text-destructive"}`}>
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </Card>
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
      <StatsCard title="Total Boletines" value={totalBoletines.toLocaleString()} description="Boletines publicados" />
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
