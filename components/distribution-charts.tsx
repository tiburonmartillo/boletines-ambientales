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
    color: "#10b981", // Verde esmeralda
  },
}

const girosConfig = {
  count: {
    label: "Proyectos",
    color: "#f59e0b", // Ámbar
  },
}

export function DistributionCharts({ municipiosData, girosData }: DistributionChartsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Distribución de Proyectos</h3>
          <p className="text-sm text-gray-600 mt-1">Análisis por municipio y giro empresarial</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Por Municipio</h4>
            <ChartContainer config={municipiosConfig} className="h-[250px] w-full">
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
            <h4 className="text-lg font-medium text-gray-800 mb-4">Por Giro</h4>
            <ChartContainer config={girosConfig} className="h-[250px] w-full">
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
