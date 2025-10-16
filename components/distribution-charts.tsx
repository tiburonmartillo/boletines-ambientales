"use client"

import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface DistributionChartsProps {
  municipiosData: Array<{ municipio: string; count: number }>
  girosData: Array<{ giro: string; count: number }>
}

const municipiosConfig = {
  count: {
    label: "Proyectos",
    color: "#1E3A8A", // Blue
  },
}

const girosConfig = {
  count: {
    label: "Proyectos",
    color: "#F97316", // Orange
  },
}

export function DistributionCharts({ municipiosData, girosData }: DistributionChartsProps) {
  return (
    <div className="bg-white rounded-xl border border-[#1E3A8A]/10  p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#000000]">Distribución de Proyectos</h3>
          <p className="text-xs sm:text-sm text-[#000000]/70 mt-1">Análisis por municipio y giro empresarial</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          <div>
            <h4 className="text-base sm:text-lg font-medium text-[#000000] mb-3 sm:mb-4">Por Municipio</h4>
            <ChartContainer config={municipiosConfig} className="h-[200px] sm:h-[250px] w-full">
              <BarChart data={municipiosData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="municipio"
                  stroke="#6b7280"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" name="Proyectos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-medium text-[#000000] mb-3 sm:mb-4">Por Giro</h4>
            <ChartContainer config={girosConfig} className="h-[200px] sm:h-[250px] w-full">
              <BarChart data={girosData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="giro"
                  stroke="#6b7280"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" name="Proyectos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
