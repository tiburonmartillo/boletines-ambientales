'use client'

import { Box, Heading, Text, Button, Separator, Flex, Card, Link } from '@radix-ui/themes'
import { Boletin } from '@/lib/types'
import { BoletinSummaryProject } from './boletin-summary-project'
import { 
  calcularFechaLimiteConsulta, 
  formatearFechaCorta, 
  getTextoResolutivos,
  generarTituloBoletin 
} from '@/lib/boletin-utils'
import '@/styles/boletin-summary.css'

interface BoletinSummaryProps {
  boletin: Boletin
  showPrintButton?: boolean
  showDownloadButton?: boolean
  onDownloadPDF?: () => void
  staticMode?: boolean // Nueva prop para modo estático (para PDF)
}

export function BoletinSummary({ 
  boletin, 
  showPrintButton = true,
  showDownloadButton = true,
  onDownloadPDF,
  staticMode = false
}: BoletinSummaryProps) {
  const fechaLimite = calcularFechaLimiteConsulta(boletin.fecha_publicacion)
  const fechaLimiteFormateada = formatearFechaCorta(fechaLimite)

  const handlePrint = () => {
    window.print()
  }

  return (
    <Card id="boletin-summary" className="boletin-summary">
      {/* Header */}
      <Box p="4" style={{ backgroundColor: '#F97316', color: '#ffffff' }}>
        <Flex direction="column" gap="2" align="center">
          <Heading size="8" weight="bold">
            Resumen del Boletín Ambiental de SSMAA
          </Heading>
          <Text size="5">
            {formatearFechaCorta(boletin.fecha_publicacion)}
          </Text>
        </Flex>
      </Box>

      {/* Contenido principal */}
      <Box p="4">
        {/* Sección de proyectos ingresados */}
        {boletin.proyectos_ingresados && boletin.proyectos_ingresados.length > 0 && (
          <Flex direction="column" gap="4" mb="6">
            <Heading size="6" weight="bold">
              Proyectos ingresados a impacto ambiental
            </Heading>
            
            <Text size="3" color="gray">
              Fecha límite para solicitud de consulta pública: {fechaLimiteFormateada}
            </Text>

            <Separator />

            {/* Lista de proyectos */}
            {boletin.proyectos_ingresados.map((proyecto, index) => (
              <BoletinSummaryProject
                key={`proyecto-${proyecto.expediente}`}
                proyecto={proyecto}
                numero={index + 1}
                tipo="proyecto"
                staticMode={staticMode}
                todosLosProyectos={boletin.proyectos_ingresados}
              />
            ))}
          </Flex>
        )}

        {/* Sección de resolutivos emitidos */}
        <Flex direction="column" gap="4" mb="6">
          <Heading size="6" weight="bold" align="center">
            {getTextoResolutivos(boletin)}
          </Heading>

          {/* Lista de resolutivos */}
          {boletin.resolutivos_emitidos && boletin.resolutivos_emitidos.length > 0 && (
            <>
              <Separator />
              {boletin.resolutivos_emitidos.map((resolutivo, index) => (
                <BoletinSummaryProject
                  key={`resolutivo-${resolutivo.expediente}`}
                  proyecto={resolutivo}
                  numero={index + 1}
                  tipo="resolutivo"
                  staticMode={staticMode}
                  todosLosProyectos={boletin.proyectos_ingresados}
                />
              ))}
            </>
          )}
        </Flex>

      </Box>

      {/* Footer */}
      <Box p="4" style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <Flex 
          justify="between" 
          align="center"
          direction={{ initial: 'column', md: 'row' }}
          gap="4"
        >
          {/* Información legal */}
          <Flex direction="column" gap="2">
            <Text size="1" color="gray">
              La información presentada es obtenida de{' '}
              <Link
                href="https://www.aguascalientes.gob.mx/SSMAA/BoletinesSMA/usuario_webexplorer.asp"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.aguascalientes.gob.mx/SSMAA/BoletinesSMA/usuario_webexplorer.asp
              </Link>
            </Text>
            <Text size="1" color="gray">
              La precisión de las ubicaciones y la calidad de la información son responsabilidad de la Secretaría de Sustentabilidad, Medio Ambiente y Agua.
            </Text>
            <Text size="1" color="gray">
              ADN-A se limita a compartir información pública de interés para la sociedad.
            </Text>
          </Flex>

          {/* Logo */}
          <img
            src="/assets/logocompleto.png"
            alt="Alianza por la Defensa de la Naturaleza Aguascalientes"
            style={{ height: '60px', width: 'auto' }}
          />
        </Flex>
      </Box>

      {/* Estilos CSS para impresión */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          #boletin-summary {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </Card>
  )
}
