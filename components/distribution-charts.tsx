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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Proyectos por Municipio</h3>
        <ChartContainer config={municipiosConfig} className="h-[300px] w-full">
          <BarChart data={municipiosData.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="municipio"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" name="Proyectos" />
          </BarChart>
        </ChartContainer>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Proyectos por Giro</h3>
        <ChartContainer config={girosConfig} className="h-[300px] w-full">
          <BarChart data={girosData.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="giro"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" name="Proyectos" />
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  )
}
