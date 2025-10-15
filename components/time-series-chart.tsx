"use client"

import { memo } from "react"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

interface TimeSeriesChartProps {
  data: Array<{
    fecha: string
    proyectos: number
    resolutivos: number
  }>
}

const chartConfig = {
  proyectos: {
    label: "Proyectos Ingresados",
    color: "#3b82f6", // Azul
  },
  resolutivos: {
    label: "Resolutivos Emitidos",
    color: "#ec4899", // Rosa
  },
}

export const TimeSeriesChart = memo(function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Tendencia Temporal</h3>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="fecha"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend
            wrapperStyle={{
              color: "hsl(var(--foreground))",
            }}
          />
          <Line
            type="monotone"
            dataKey="proyectos"
            stroke="var(--color-proyectos)"
            strokeWidth={2}
            name="Proyectos Ingresados"
            dot={{ fill: "var(--color-proyectos)", stroke: "hsl(var(--background))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="resolutivos"
            stroke="var(--color-resolutivos)"
            strokeWidth={2}
            name="Resolutivos Emitidos"
            dot={{ fill: "var(--color-resolutivos)", stroke: "hsl(var(--background))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  )
})
