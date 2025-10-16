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
    color: "#1E3A8A", // Blue
  },
  resolutivos: {
    label: "Resolutivos Emitidos",
    color: "#F97316", // Orange
  },
}

export const TimeSeriesChart = memo(function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  return (
    <div className="bg-white rounded-xl border border-[#1E3A8A]/10 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#000000]">Tendencia Temporal</h3>
          <p className="text-xs sm:text-sm text-[#000000]/70 mt-1">Evolución de proyectos ingresados y resolutivos emitidos en el tiempo</p>
        </div>
        <ChartContainer config={chartConfig} className="h-[300px] sm:h-[400px] w-full">
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
              strokeWidth={2}
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
