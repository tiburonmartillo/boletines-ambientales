'use client'

import { Box, Heading, Text, Card, Separator, Flex } from '@radix-ui/themes'
import { Proyecto, Resolutivo } from '@/lib/types'
import { ClientOnlyMap } from './client-only-map'
import { formatearFechaCorta } from '@/lib/boletin-utils'

interface ProjectSummaryProps {
  proyecto: Proyecto | Resolutivo
  numero: number
  tipo: 'proyecto' | 'resolutivo'
  staticMode?: boolean // Nueva prop para modo estático (para PDF)
  todosLosProyectos?: Proyecto[] // Proyectos del boletín para buscar coordenadas
}

export function BoletinSummaryProject({ proyecto, numero, tipo, staticMode = false, todosLosProyectos = [] }: ProjectSummaryProps) {
  const isResolutivo = tipo === 'resolutivo'
  const resolutivo = isResolutivo ? proyecto as Resolutivo : null
  
  // Para resolutivos, buscar coordenadas del proyecto ingresado correspondiente
  let coordenadas_x = proyecto.coordenadas_x
  let coordenadas_y = proyecto.coordenadas_y
  
  if (isResolutivo && !coordenadas_x && !coordenadas_y && todosLosProyectos.length > 0) {
    // Buscar el proyecto ingresado con el mismo expediente
    const proyectoIngresado = todosLosProyectos.find(p => p.expediente === proyecto.expediente)
    if (proyectoIngresado) {
      coordenadas_x = proyectoIngresado.coordenadas_x
      coordenadas_y = proyectoIngresado.coordenadas_y
    }
  }

  return (
    <Card>
      <Box p="4" mb="4">
        <Flex 
        gap="4"
        direction={{ initial: 'column', lg: 'row' }}
      >
        {/* Información del proyecto - Columna izquierda */}
        <Flex direction="column" gap="3" style={{ flex: 1 }}>
          <Heading size="4" weight="bold">
            {proyecto.nombre_proyecto}
          </Heading>

          <Flex direction="column" gap="2" wrap="wrap">
            {/* Promovente */}
            <Box>
              <Text size="2" weight="bold">Promovente:</Text>
              <Text size="2" color="gray">{proyecto.promovente}</Text>
            </Box>

            {/* Municipio */}
            <Box>
              <Text size="2" weight="bold">Municipio:</Text>
              <Text size="2" color="gray">{proyecto.municipio}</Text>
            </Box>

            {/* Expediente */}
            <Box>
              <Text size="2" weight="bold">Expediente:</Text>
              <Text size="2" color="gray">{proyecto.expediente}</Text>
            </Box>

            {/* Fechas */}
            <Box>
              <Text size="2" weight="bold">
                {isResolutivo ? 'Fecha de ingreso:' : 'Fechas de ingreso:'}
              </Text>
              <Text size="2" color="gray">
                {formatearFechaCorta(proyecto.fecha_ingreso)}
              </Text>
            </Box>

            {/* Fecha de resolutivo (solo para resolutivos) */}
            {isResolutivo && resolutivo && (
              <Box>
                <Text size="2" weight="bold">Fecha de resolutivo:</Text>
                <Text size="2" color="gray">
                  {formatearFechaCorta(resolutivo.fecha_resolutivo)}
                </Text>
              </Box>
            )}

            {/* Tipo de estudio */}
            <Box>
              <Text size="2" weight="bold">Tipo:</Text>
              <Text size="2" color="gray">{proyecto.tipo_estudio}</Text>
            </Box>
          </Flex>
        </Flex>

        {/* Mapa - Columna derecha */}
        <Box>
          {coordenadas_x && coordenadas_y ? (
            <ClientOnlyMap
              coordenadas_x={coordenadas_x}
              coordenadas_y={coordenadas_y}
              municipio={proyecto.municipio}
              width={400}
              height={300}
              showLink={false}
              staticMode={staticMode}
            />
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              p="3"
              style={{ width: '100%', height: 300 }}
            >
              <Text size="2" color="gray" align="center">
                Mapas de ubicación no disponibles
              </Text>
              <Text size="1" color="gray" align="center" mt="2">
                Este {isResolutivo ? 'resolutivo' : 'proyecto'} no tiene coordenadas registradas
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>

      {/* Naturaleza del proyecto */}
      <Box mt="3">
        <Text size="2" weight="bold" mb="2">
          Naturaleza del proyecto:
        </Text>
        <Box p="3">
          <Text size="2">
            {proyecto.naturaleza_proyecto}
          </Text>
        </Box>
      </Box>

      {/* Separador entre proyectos */}
      {numero > 1 && (
        <Separator mt="4" />
      )}
      </Box>
    </Card>
  )
}
