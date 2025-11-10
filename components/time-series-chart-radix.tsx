"use client"

import { memo } from "react"
import { Card, Text, Flex, Heading, Box } from "@radix-ui/themes"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Dot
} from "recharts"

interface TimeSeriesChartRadixProps {
  data: Array<{
    fecha: string
    proyectos: number
    resolutivos: number
  }>
  onDateSelect?: (fecha: string | null) => void
}

export const TimeSeriesChartRadix = memo(function TimeSeriesChartRadix({ 
  data, 
  onDateSelect
}: TimeSeriesChartRadixProps) {
  // Ensure we have data
  if (!data || data.length === 0) {
    return (
      <Card>
        <Flex direction="column" gap="3" p="4">
          <Heading size="5" weight="bold">
            Tendencia Temporal
          </Heading>
          <Text size="2" color="gray">
            No hay datos disponibles para mostrar
          </Text>
        </Flex>
      </Card>
    )
  }

  // Transform data for Recharts
  const chartData = data.map(item => ({
    fecha: item.fecha,
    proyectos: item.proyectos,
    resolutivos: item.resolutivos,
  }))

  const handleChartClick = (data: any) => {
    if (onDateSelect && data && data.activePayload && data.activePayload[0]) {
      const payload = data.activePayload[0].payload
      const index = chartData.findIndex(item => item.fecha === payload.fecha)
      if (index !== -1) {
        onDateSelect(chartData[index].fecha)
      }
    }
  }

  return (
    <Card>
      <Flex direction="column" gap="4" p="4">
        <Flex direction="column" gap="2">
          <Heading size="5" weight="bold">
            Tendencia Temporal
          </Heading>
          <Text size="2" color="gray">
            Evolución de proyectos ingresados y resolutivos emitidos en el tiempo
          </Text>
          <Text size="2" color="gray">
            Haz clic en cualquier punto de la gráfica para filtrar por esa fecha
          </Text>
        </Flex>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            onClick={handleChartClick}
          >
            <CartesianGrid />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="linear" 
              dataKey="proyectos" 
              name="Proyectos Ingresados"
            />
            <Line 
              type="linear" 
              dataKey="resolutivos" 
              name="Resolutivos Emitidos"
            />
          </LineChart>
        </ResponsiveContainer>
      </Flex>
    </Card>
  )
})

