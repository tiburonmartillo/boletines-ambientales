"use client"

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { BoletinSummary } from './boletin-summary'
import { generateBoletinPDFRobust } from '@/lib/pdf-generator'
import { Boletin } from '@/lib/types'
import { formatearFechaCorta } from '@/lib/boletin-utils'

interface BoletinModalProps {
  boletin: Boletin | null
  isOpen: boolean
  onClose: () => void
}

export function BoletinModal({ boletin, isOpen, onClose }: BoletinModalProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    if (!boletin) return
    
    try {
      setIsGeneratingPDF(true)
      await generateBoletinPDFRobust('boletin-summary', `Resumen-Boletin-SSMAA-${boletin.id}.pdf`)
    } catch (err) {
      console.error('Error al generar PDF:', err)
      alert('Error al generar el PDF. Por favor, intenta de nuevo.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Manejar escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!boletin) return null

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black opacity-75"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Resumen Boletín #{boletin.id}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {boletin.fecha_publicacion ? 
                    formatearFechaCorta(boletin.fecha_publicacion) : 'Fecha no disponible'
                  }
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="p-6">
                <BoletinSummary
                  boletin={boletin}
                  showPrintButton={false}
                  showDownloadButton={false}
                  staticMode={false}
                />
              </div>
            </div>
            
            {/* Footer - Fixed at bottom */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                Cerrar
              </Button>
              
              <div className="flex gap-3">
                {boletin.url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(boletin.url, '_blank', 'noopener,noreferrer')}
                    className="border-[#F97316] text-[#F97316] hover:bg-[#FFF7ED]"
                  >
                    📄 Consultar Boletín Original
                  </Button>
                )}
                
                <Button
                  variant="default"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white"
                >
                  {isGeneratingPDF ? 'Generando PDF...' : '📋 Descargar PDF'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
