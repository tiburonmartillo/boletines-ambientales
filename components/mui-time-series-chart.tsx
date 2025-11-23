"use client"

import { memo } from "react"
import { Card, CardContent, Typography, Box, Chip } from "@mui/material"
import { LineChart } from "@mui/x-charts/LineChart"
import { styled } from "@mui/material/styles"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: '1px solid rgba(30, 58, 138, 0.1)',
}))

interface MuiTimeSeriesChartProps {
  data: Array<{
    fecha: string
    proyectos: number
    resolutivos: number
  }>
  onDateSelect?: (fecha: string | null) => void
}

export const MuiTimeSeriesChart = memo(function MuiTimeSeriesChart({ 
  data, 
  onDateSelect
}: MuiTimeSeriesChartProps) {
  // Ensure we have data
  if (!data || data.length === 0) {
    return (
      <StyledCard elevation={0}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" component="h3" fontWeight="semibold" color="text.primary">
            Tendencia Temporal
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No hay datos disponibles para mostrar
          </Typography>
        </CardContent>
      </StyledCard>
    )
  }

  // Transform data for MUI X Charts
  const chartData = data.map(item => ({
    fecha: item.fecha,
    proyectos: item.proyectos,
    resolutivos: item.resolutivos,
  }))

  return (
    <StyledCard elevation={0}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
          <Box>
            <Typography 
              variant="h6" 
              component="h3" 
              fontWeight="semibold" 
              color="text.primary"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Tendencia Temporal
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: { xs: 0.5, sm: 0.5 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Evolución de proyectos ingresados y resolutivos emitidos en el tiempo
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Haz clic en cualquier punto de la gráfica para filtrar por esa fecha
            </Typography>
          </Box>
          
          <Box sx={{ 
            width: '100%', 
            height: { xs: '250px', sm: '300px', md: '350px', lg: '400px' },
            minHeight: '250px'
          }}>
            <LineChart
              dataset={chartData}
              xAxis={[{
                dataKey: 'fecha',
                scaleType: 'band',
              }]}
              yAxis={[{}]}
              series={[
                {
                  dataKey: 'proyectos',
                  label: 'Proyectos Ingresados',
                  color: '#1E3A8A',
                  area: false,
                  curve: 'linear',
                  showMark: true,
                },
                {
                  dataKey: 'resolutivos',
                  label: 'Resolutivos Emitidos',
                  color: '#F97316',
                  area: false,
                  curve: 'linear',
                  showMark: true,
                },
              ]}
              width={undefined}
              height={undefined}
              onLineClick={(event, item) => {
                if (onDateSelect && item && typeof item.dataIndex === 'number') {
                  const fecha = chartData[item.dataIndex]?.fecha
                  onDateSelect(fecha || null)
                }
              }}
              sx={{
                width: '100%',
                height: '100%',
                '& .MuiLineElement-root': {
                  cursor: 'pointer'
                },
                '& .MuiMarkElement-root': {
                  cursor: 'pointer'
                }
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  )
})
