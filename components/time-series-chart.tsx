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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Tendencia Temporal</h3>
          <p className="text-sm text-gray-600 mt-1">Evolución de proyectos y resolutivos en el tiempo</p>
        </div>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="fecha"
              stroke="#6b7280"
              tick={{ 
                fill: "#6b7280", 
                fontSize: 12
              }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend
              wrapperStyle={{
                color: "#374151",
              }}
            />
            <Line
              type="monotone"
              dataKey="proyectos"
              stroke="var(--color-proyectos)"
              strokeWidth={3}
              name="Proyectos Ingresados"
              dot={{ fill: "var(--color-proyectos)", stroke: "#ffffff", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="resolutivos"
              stroke="var(--color-resolutivos)"
              strokeWidth={3}
              name="Resolutivos Emitidos"
              dot={{ fill: "var(--color-resolutivos)", stroke: "#ffffff", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
})
