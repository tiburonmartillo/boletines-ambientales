import { Card, CardContent, Typography, Box } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: '1px solid rgba(30, 58, 138, 0.1)',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}))

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
    <StyledCard elevation={0}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="medium">
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" component="h3" fontWeight="bold" color="text.primary">
              {value}
            </Typography>
            {trend && (
              <Typography 
                variant="body2" 
                fontWeight="medium"
                color={trend.isPositive ? "success.main" : "error.main"}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </Typography>
            )}
          </Box>
          {description && (
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  )
}

interface MuiDashboardStatsProps {
  totalBoletines: number
  totalProyectos: number
  totalResolutivos: number
  municipios: number
}

export function MuiDashboardStats({ totalBoletines, totalProyectos, totalResolutivos, municipios }: MuiDashboardStatsProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
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
    </Box>
  )
}
