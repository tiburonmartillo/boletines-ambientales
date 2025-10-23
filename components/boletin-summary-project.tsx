'use client'

import { Box, Typography, Paper, Divider } from '@mui/material'
import { Proyecto, Resolutivo } from '@/lib/types'
import { ClientOnlyMap } from './client-only-map'
import { formatearFechaCorta } from '@/lib/boletin-utils'

interface ProjectSummaryProps {
  proyecto: Proyecto | Resolutivo
  numero: number
  tipo: 'proyecto' | 'resolutivo'
  staticMode?: boolean // Nueva prop para modo estático (para PDF)
}

export function BoletinSummaryProject({ proyecto, numero, tipo, staticMode = false }: ProjectSummaryProps) {
  const isResolutivo = tipo === 'resolutivo'
  const resolutivo = isResolutivo ? proyecto as Resolutivo : null

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        backgroundColor: '#ffffff'
      }}
    >
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Información del proyecto - Columna izquierda */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 'bold',
              color: '#1F2937',
              mb: 2,
              fontSize: '1.1rem'
            }}
          >
            {proyecto.nombre_proyecto}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Promovente */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#374151' }}>
                Promovente:
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 1 }}>
                {proyecto.promovente}
              </Typography>
            </Box>

            {/* Municipio */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#374151' }}>
                Municipio:
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 1 }}>
                {proyecto.municipio}
              </Typography>
            </Box>

            {/* Expediente */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#374151' }}>
                Expediente:
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 1 }}>
                {proyecto.expediente}
              </Typography>
            </Box>

            {/* Fechas */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#374151' }}>
                {isResolutivo ? 'Fecha de ingreso:' : 'Fechas de ingreso:'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 1 }}>
                {formatearFechaCorta(proyecto.fecha_ingreso)}
              </Typography>
            </Box>

            {/* Fecha de resolutivo (solo para resolutivos) */}
            {isResolutivo && resolutivo && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#374151' }}>
                  Fecha de resolutivo:
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', ml: 1 }}>
                  {formatearFechaCorta(resolutivo.fecha_resolutivo)}
                </Typography>
              </Box>
            )}

            {/* Tipo de estudio */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#374151' }}>
                Tipo:
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', ml: 1 }}>
                {proyecto.tipo_estudio}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Mapa - Columna derecha */}
        <Box sx={{ width: 400, flexShrink: 0 }}>
          <ClientOnlyMap
            coordenadas_x={proyecto.coordenadas_x}
            coordenadas_y={proyecto.coordenadas_y}
            municipio={proyecto.municipio}
            width={400}
            height={300}
            showLink={false}
            staticMode={staticMode}
          />
        </Box>
      </Box>

      {/* Naturaleza del proyecto - Ocupa el 100% del ancho debajo del contenido principal */}
      <Box sx={{ mt: 2, width: '100%' }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#374151', mb: 1 }}>
          Naturaleza del proyecto:
        </Typography>
        <Box
          sx={{
            p: 2,
            border: '1px solid #d1d5db',
            borderRadius: 1,
            backgroundColor: '#f9fafb',
            width: '100%'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#374151',
              lineHeight: 1.5,
              fontSize: '0.875rem'
            }}
          >
            {proyecto.naturaleza_proyecto}
          </Typography>
        </Box>
      </Box>

      {/* Separador entre proyectos */}
      {numero > 1 && (
        <Divider sx={{ mt: 3, borderColor: '#e5e7eb' }} />
      )}
    </Paper>
  )
}
