'use client'

import React from 'react'
import { Box, Button } from '@mui/material'
import { BoletinSummary } from '@/components/boletin-summary'
import { generateBoletinPDF } from '@/lib/pdf-generator'
import { Boletin } from '@/lib/types'

interface BoletinSummaryWrapperProps {
  boletin: Boletin
}

export function BoletinSummaryWrapper({ boletin }: BoletinSummaryWrapperProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false)

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true)
      await generateBoletinPDF('boletin-summary', `Resumen-Boletin-SSMAA-${boletin.id}.pdf`)
    } catch (err) {
      console.error('Error al generar PDF:', err)
      alert('Error al generar el PDF. Por favor, intenta de nuevo.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleBackToDashboard = () => {
    window.location.href = '/boletines-ssmaa'
  }

  return (
    <>
      <BoletinSummary
        boletin={boletin}
        showPrintButton={true}
        showDownloadButton={true}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* Botones de navegación */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={handleBackToDashboard}
          sx={{
            borderColor: '#F97316',
            color: '#F97316',
            '&:hover': {
              borderColor: '#EA580C',
              backgroundColor: '#FFF7ED'
            }
          }}
        >
          Volver al Dashboard
        </Button>
        
        <Button
          variant="contained"
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          sx={{
            backgroundColor: '#F97316',
            '&:hover': {
              backgroundColor: '#EA580C'
            }
          }}
        >
          {isGeneratingPDF ? 'Generando PDF...' : 'Descargar PDF'}
        </Button>
      </Box>
    </>
  )
}
