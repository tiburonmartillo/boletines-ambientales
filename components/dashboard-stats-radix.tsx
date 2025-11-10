import { Card, Text, Flex, Heading } from '@radix-ui/themes'

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
    <Card>
      <Flex direction="column" gap="3" p="4">
        <Text size="2" weight="medium" color="gray">
          {title}
        </Text>
        <Flex align="baseline" gap="2">
          <Heading size="8" weight="bold">
            {value}
          </Heading>
          {trend && (
            <Text 
              size="2" 
              weight="medium"
              color={trend.isPositive ? "green" : "red"}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </Text>
          )}
        </Flex>
        {description && (
          <Text size="1" color="gray">
            {description}
          </Text>
        )}
      </Flex>
    </Card>
  )
}

interface DashboardStatsRadixProps {
  totalBoletines: number
  totalProyectos: number
  totalResolutivos: number
  municipios: number
}

export function DashboardStatsRadix({ totalBoletines, totalProyectos, totalResolutivos, municipios }: DashboardStatsRadixProps) {
  return (
    <Flex direction="row" gap="4" wrap="wrap">
      <StatsCard 
        title="Total Boletines" 
        value={totalBoletines.toLocaleString()} 
        description="Boletines disponibles publicados" 
      />
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
      <StatsCard 
        title="Municipios" 
        value={municipios} 
        description="Municipios con proyectos" 
      />
    </Flex>
  )
}

