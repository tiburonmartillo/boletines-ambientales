"use client"

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { Box, Typography, Button, IconButton, Paper, Divider, Chip, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import ReactMarkdown from "react-markdown"
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import type { ProcessedGacetaAnalysis, RegistroGaceta } from '@/hooks/useGacetasData'

interface GacetaModalProps {
  gaceta: ProcessedGacetaAnalysis | null
  registro: RegistroGaceta | null
  isOpen: boolean
  onClose: () => void
}

interface SemarnatApiResponse {
  data?: any
  error?: string
  details?: string
  mensaje?: string
  detalle?: string
  resumen?: string
  estudio?: string
  resolutivo?: string
}

export function GacetaModal({ gaceta, registro, isOpen, onClose }: GacetaModalProps) {
  const [semarnatData, setSemarnatData] = useState<any>(null)
  const [loadingSemarnat, setLoadingSemarnat] = useState(false)
  const [errorSemarnat, setErrorSemarnat] = useState<string | null>(null)
  const [pdfResponseData, setPdfResponseData] = useState<{ [key: string]: any }>({})
  const [loadingPdf, setLoadingPdf] = useState<{ [key: string]: boolean }>({})
  const [historialData, setHistorialData] = useState<any>(null)
  const [loadingHistorial, setLoadingHistorial] = useState(false)
  const [errorHistorial, setErrorHistorial] = useState<string | null>(null)
  // Manejar escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Usar useRef para trackear el registro actual y cancelar requests anteriores
  const registroKeyRef = useRef<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Memoizar clave única del registro para evitar re-fetches innecesarios
  const registroId = registro?.id
  const registroClave = registro?.clave_proyecto
  const registroKey = useMemo(() => {
    if (!registro) return null
    return `${registroId || registroClave || ''}-${registroClave || ''}`
  }, [registro, registroId, registroClave])

  // Procesar datos SEMARNAT desde el registro (memoizado)
  const registroSemarnatData = registro?.semarnat_data
  const semarnatDataFromRegistro = useMemo(() => {
    if (!registroSemarnatData) return null
    
    if (registroSemarnatData.error) {
      return { error: registroSemarnatData.error, data: null }
    }
    
    if (registroSemarnatData.mensaje === 'error' && 
        !registroSemarnatData.resumen && 
        !registroSemarnatData.estudio && 
        !registroSemarnatData.resolutivo) {
      return { error: registroSemarnatData.detalle || 'Error en datos de SEMARNAT', data: null }
    }
    
    return { error: null, data: registroSemarnatData }
  }, [registroSemarnatData])

  // Procesar historial desde el registro (memoizado)
  const semarnatHistorial = registro?.semarnat_historial
  const historialFromRegistro = useMemo(() => {
    if (!semarnatHistorial) return null
    
    const tieneHistorial = (semarnatHistorial.historial && 
                           Array.isArray(semarnatHistorial.historial) && 
                           semarnatHistorial.historial.length > 0) ||
                          (Array.isArray(semarnatHistorial) && 
                           semarnatHistorial.length > 0)
    
    if (tieneHistorial) {
      return { error: null, data: semarnatHistorial }
    }
    
    if (semarnatHistorial.error || 
        (semarnatHistorial.mensaje === 'error' && !tieneHistorial)) {
      return { 
        error: semarnatHistorial.detalle || 
               semarnatHistorial.error || 
               'No hay historial disponible', 
        data: null 
      }
    }
    
    return { error: null, data: semarnatHistorial }
  }, [semarnatHistorial])

  // Efecto para cargar datos SEMARNAT
  // PRIORIDAD: Primero intentar API en tiempo real, luego fallback a JSON enriquecido
  useEffect(() => {
    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (!isOpen || !registro?.clave_proyecto) {
      setSemarnatData(null)
      setErrorSemarnat(null)
      setLoadingSemarnat(false)
      return
    }

    // Si el registro cambió, limpiar estados
    if (registroKeyRef.current !== registroKey) {
      registroKeyRef.current = registroKey
      setPdfResponseData({})
      setLoadingPdf({})
    }

    // PRIORIDAD 1: Intentar obtener datos desde la API en tiempo real
    const controller = new AbortController()
    abortControllerRef.current = controller

    const fetchSemarnatData = async () => {
      setLoadingSemarnat(true)
      setErrorSemarnat(null)
      setSemarnatData(null)

      try {
        const response = await fetch('/api/semarnat-proyecto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clave: registro.clave_proyecto }),
          signal: controller.signal
        })

        if (controller.signal.aborted) return

        const data: SemarnatApiResponse = await response.json()

        if (controller.signal.aborted) return

        // Si la petición fue exitosa y tiene datos válidos
        if (response.ok && !data.error && (data.resumen || data.estudio || data.resolutivo)) {
          setSemarnatData(data)
          setErrorSemarnat(null)
          setLoadingSemarnat(false)
          return
        }

        // Si la petición fue rechazada o falló, hacer fallback al JSON
        throw new Error(data.error || 'Petición rechazada')

      } catch (error: any) {
        if (error.name === 'AbortError') return
        
        // FALLBACK: Usar datos del JSON enriquecido si están disponibles
        if (semarnatDataFromRegistro) {
          if (semarnatDataFromRegistro.error) {
            setErrorSemarnat(semarnatDataFromRegistro.error)
            setSemarnatData(null)
          } else {
            setSemarnatData(semarnatDataFromRegistro.data)
            setErrorSemarnat(null)
          }
          setLoadingSemarnat(false)
          return
        }

        // Si no hay datos en el JSON ni en la API, mostrar error
        setErrorSemarnat('Error al conectar con el servicio de SEMARNAT')
        setSemarnatData(null)
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSemarnat(false)
        }
      }
    }

    fetchSemarnatData()

    return () => {
      controller.abort()
    }
  }, [isOpen, registro?.clave_proyecto, registroKey, semarnatDataFromRegistro])

  // Efecto separado para cargar historial
  // PRIORIDAD: Primero intentar API en tiempo real, luego fallback a JSON enriquecido
  const historialRegistroId = registro?.id
  const historialRegistroClave = registro?.clave_proyecto
  useEffect(() => {
    if (!isOpen || !registro) {
      setHistorialData(null)
      setErrorHistorial(null)
      setLoadingHistorial(false)
      return
    }

    if (!historialRegistroId && !historialRegistroClave) {
      setHistorialData(null)
      setErrorHistorial(null)
      setLoadingHistorial(false)
      return
    }

    // PRIORIDAD 1: Intentar obtener historial desde la API en tiempo real
    const controller = new AbortController()

    const fetchHistorialData = async () => {
      setLoadingHistorial(true)
      setErrorHistorial(null)
      setHistorialData(null)

      try {
        const response = await fetch('/api/semarnat-historial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ numBitacora: historialRegistroId || historialRegistroClave }),
          signal: controller.signal
        })

        if (controller.signal.aborted) return

        const data = await response.json()

        if (controller.signal.aborted) return

        // Si la petición fue exitosa y tiene historial válido
        const tieneHistorial = (data.historial && Array.isArray(data.historial) && data.historial.length > 0) ||
                              (Array.isArray(data) && data.length > 0)

        if (response.ok && tieneHistorial) {
          setHistorialData(data)
          setErrorHistorial(null)
          setLoadingHistorial(false)
          return
        }

        // Si la petición fue rechazada o falló, hacer fallback al JSON
        throw new Error(data.error || data.mensaje || 'Petición rechazada')

      } catch (error: any) {
        if (error.name === 'AbortError') return
        
        // FALLBACK: Usar historial del JSON enriquecido si está disponible
        if (historialFromRegistro) {
          if (historialFromRegistro.error) {
            setErrorHistorial(historialFromRegistro.error)
            setHistorialData(null)
          } else {
            setHistorialData(historialFromRegistro.data)
            setErrorHistorial(null)
          }
          setLoadingHistorial(false)
          return
        }

        // Si no hay datos en el JSON ni en la API, mostrar error
        setErrorHistorial('Error al conectar con el servicio de historial')
        setHistorialData(null)
      } finally {
        if (!controller.signal.aborted) {
          setLoadingHistorial(false)
        }
      }
    }

    fetchHistorialData()

    return () => {
      controller.abort()
    }
  }, [isOpen, registro, historialRegistroId, historialRegistroClave, historialFromRegistro])

  if (!gaceta || !isOpen) return null

  // Verificar si la fecha es solo año (formato YYYY-01-01) o una fecha completa
  const fechaFormateada = (() => {
    try {
      const fecha = new Date(gaceta.fecha_publicacion)
      // Si la fecha es el 1 de enero, probablemente es solo el año
      if (fecha.getMonth() === 0 && fecha.getDate() === 1) {
        // Verificar si es el mismo año que gaceta.año
        if (fecha.getFullYear() === gaceta.año) {
          return `Año ${gaceta.año}`
        }
      }
      return fecha.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return `Año ${gaceta.año}`
    }
  })()

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 4 }
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0, 0, 0, 0.75)',
          zIndex: -1
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <Paper
        elevation={24}
        sx={{
          position: 'relative',
          maxWidth: '900px',
          width: '100%',
          maxHeight: { xs: '95vh', sm: '90vh' },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        {/* Header - Fixed */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: { xs: 2, sm: 3 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            bgcolor: 'background.paper',
            zIndex: 10
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
            <Typography
              variant="h6"
              component="h2"
              fontWeight="semibold"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              Gaceta Ecológica SEMARNAT {gaceta.gaceta_id ? `#${gaceta.gaceta_id}` : ''}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {fechaFormateada}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ flexShrink: 0 }}
            aria-label="Cerrar"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content - Scrollable */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            minHeight: 0,
            position: 'relative'
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 10, sm: 12 } }}>
            {/* Información del Registro Seleccionado */}
            {registro && (
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    fontWeight="semibold"
                    sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    Información del Registro
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Clave del Proyecto
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" sx={{ mb: 2 }}>
                        {registro.clave_proyecto || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Tipo de Registro
                      </Typography>
                      <Chip 
                        label={registro.tipo_registro === 'proyecto_ingresado' ? 'Proyecto Ingresado' : 
                               registro.tipo_registro === 'resolutivo_emitido' ? 'Resolutivo Emitido' :
                               registro.tipo_registro === 'tramite_unificado' ? 'Trámite Unificado' :
                               registro.tipo_registro} 
                        size="small" 
                        color={registro.tipo_registro === 'resolutivo_emitido' ? 'success' : 'primary'}
                        sx={{ mb: 2 }}
                      />
                    </Box>
                    
                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Nombre del Proyecto
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {registro.proyecto_nombre || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Promovente
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {registro.promovente || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Modalidad
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {registro.modalidad || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Entidad
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {registro.entidad || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Municipio
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {registro.municipio || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Tipo de Proyecto
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {registro.tipo_proyecto || 'N/A'}
                      </Typography>
                    </Box>
                    
                    {registro.fecha_ingreso && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Fecha de Ingreso
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {new Date(registro.fecha_ingreso).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    )}
                    
                    {registro.fecha_resolucion && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Fecha de Resolución
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {new Date(registro.fecha_resolucion).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    )}
                    
                    {registro.estatus && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Estatus
                        </Typography>
                        <Chip 
                          label={registro.estatus} 
                          size="small" 
                          color={registro.estatus === 'autorizado' ? 'success' : 'default'}
                          sx={{ mb: 2 }}
                        />
                      </Box>
                    )}
                    
                    {registro.vigencia?.texto_completo && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Vigencia
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {registro.vigencia.texto_completo}
                        </Typography>
                      </Box>
                    )}
                    
                    {registro.superficie && (registro.superficie.total_hectareas || registro.superficie.cambio_uso_suelo_hectareas) && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Superficie
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {registro.superficie.total_hectareas ? `${registro.superficie.total_hectareas} ha` : ''}
                          {registro.superficie.cambio_uso_suelo_hectareas && (
                            <span> (Cambio de uso: {registro.superficie.cambio_uso_suelo_hectareas} ha)</span>
                          )}
                        </Typography>
                      </Box>
                    )}
                    
                    {registro.vegetacion?.tipo && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Vegetación
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {registro.vegetacion.tipo}
                          {registro.vegetacion.remocion && ` - Remoción: ${registro.vegetacion.remocion}`}
                        </Typography>
                      </Box>
                    )}
                    
                    {registro.ubicacion_especifica && (
                      <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Ubicación Específica
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {registro.ubicacion_especifica}
                        </Typography>
                      </Box>
                    )}
                    
                    {registro.descripcion && (
                      <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Descripción
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mb: 2,
                            whiteSpace: 'pre-wrap',
                            textAlign: 'justify'
                          }}
                        >
                          {registro.descripcion}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />

                {/* Información de SEMARNAT API */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="semibold"
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      Información del Sistema SEMARNAT
                    </Typography>
                    {registro?.clave_proyecto && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<OpenInNewIcon />}
                        onClick={() => {
                          // URL de consulta en SEMARNAT con la clave como parámetro
                          const consultaUrl = `https://app.semarnat.gob.mx/consulta-tramite/#/portal-consulta?clave=${encodeURIComponent(registro.clave_proyecto)}`
                          window.open(consultaUrl, '_blank', 'noopener,noreferrer')
                        }}
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        Consultar en SEMARNAT
                      </Button>
                    )}
                  </Box>
                  
                  {loadingSemarnat && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Cargando información del sistema SEMARNAT...
                      </Typography>
                    </Box>
                  )}
                  
                  {errorSemarnat && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      {errorSemarnat}
                    </Alert>
                  )}
                  
                  {semarnatData && !loadingSemarnat && (
                    <Box>
                      {/* Mostrar enlaces a PDFs si están disponibles */}
                      {semarnatData.resumen || semarnatData.estudio || semarnatData.resolutivo ? (
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="medium"
                            color="text.secondary"
                            sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            Documentos Disponibles
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                            {semarnatData.resumen && (
                              <Box>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<OpenInNewIcon />}
                                  disabled={loadingPdf['resumen']}
                                  onClick={async () => {
                                    setLoadingPdf(prev => ({ ...prev, resumen: true }))
                                    try {
                                      // Hacer petición POST a la API route para obtener el PDF
                                      const response = await fetch('/api/semarnat-pdf', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'text/plain',
                                        },
                                        body: semarnatData.resumen
                                      })

                                      if (response.ok) {
                                        const contentType = response.headers.get('content-type')
                                        if (contentType?.includes('application/pdf')) {
                                          // Es un PDF, crear blob y descargarlo
                                          const blob = await response.blob()
                                          const url = window.URL.createObjectURL(blob)
                                          const a = document.createElement('a')
                                          a.href = url
                                          a.download = `resumen_${registro?.clave_proyecto || 'documento'}.pdf`
                                          document.body.appendChild(a)
                                          a.click()
                                          window.URL.revokeObjectURL(url)
                                          document.body.removeChild(a)
                                          
                                          // Guardar información de la respuesta
                                          setPdfResponseData(prev => ({
                                            ...prev,
                                            resumen: { tipo: 'PDF', tamaño: blob.size, descargado: true }
                                          }))
                                        } else {
                                          // Es JSON con URL u otros datos
                                          try {
                                            const data = await response.json()
                                            setPdfResponseData(prev => ({
                                              ...prev,
                                              resumen: data
                                            }))
                                            if (data.url) {
                                              window.open(data.url, '_blank', 'noopener,noreferrer')
                                            }
                                          } catch {
                                            const text = await response.text()
                                            setPdfResponseData(prev => ({
                                              ...prev,
                                              resumen: { respuesta: text }
                                            }))
                                          }
                                        }
                                      } else {
                                        const errorText = await response.text()
                                        setPdfResponseData(prev => ({
                                          ...prev,
                                          resumen: { error: errorText, status: response.status }
                                        }))
                                      }
                                    } catch (error) {
                                      setPdfResponseData(prev => ({
                                        ...prev,
                                        resumen: { error: error instanceof Error ? error.message : 'Error desconocido' }
                                      }))
                                    } finally {
                                      setLoadingPdf(prev => ({ ...prev, resumen: false }))
                                    }
                                  }}
                                  sx={{ 
                                    py: 1.5,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                  }}
                                >
                                  {loadingPdf['resumen'] ? 'Cargando...' : 'Resumen PDF'}
                                </Button>
                              </Box>
                            )}
                            {semarnatData.estudio && (
                              <Box>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<OpenInNewIcon />}
                                  disabled={loadingPdf['estudio']}
                                  onClick={async () => {
                                    setLoadingPdf(prev => ({ ...prev, estudio: true }))
                                    try {
                                      // Hacer petición POST para obtener el PDF
                                      const response = await fetch('/api/semarnat-pdf', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'text/plain',
                                        },
                                        body: semarnatData.estudio
                                      })

                                      if (response.ok) {
                                        const contentType = response.headers.get('content-type')
                                        if (contentType?.includes('application/pdf')) {
                                          // Es un PDF, crear blob y descargarlo
                                          const blob = await response.blob()
                                          const url = window.URL.createObjectURL(blob)
                                          const a = document.createElement('a')
                                          a.href = url
                                          a.download = `estudio_${registro?.clave_proyecto || 'documento'}.pdf`
                                          document.body.appendChild(a)
                                          a.click()
                                          window.URL.revokeObjectURL(url)
                                          document.body.removeChild(a)
                                          
                                          // Guardar información de la respuesta
                                          setPdfResponseData(prev => ({
                                            ...prev,
                                            estudio: { tipo: 'PDF', tamaño: blob.size, descargado: true }
                                          }))
                                        } else {
                                          // Es JSON con URL u otros datos
                                          try {
                                            const data = await response.json()
                                            setPdfResponseData(prev => ({
                                              ...prev,
                                              estudio: data
                                            }))
                                            if (data.url) {
                                              window.open(data.url, '_blank', 'noopener,noreferrer')
                                            }
                                          } catch {
                                            const text = await response.text()
                                            setPdfResponseData(prev => ({
                                              ...prev,
                                              estudio: { respuesta: text }
                                            }))
                                          }
                                        }
                                      } else {
                                        const errorText = await response.text()
                                        setPdfResponseData(prev => ({
                                          ...prev,
                                          estudio: { error: errorText, status: response.status }
                                        }))
                                      }
                                    } catch (error) {
                                      setPdfResponseData(prev => ({
                                        ...prev,
                                        estudio: { error: error instanceof Error ? error.message : 'Error desconocido' }
                                      }))
                                    } finally {
                                      setLoadingPdf(prev => ({ ...prev, estudio: false }))
                                    }
                                  }}
                                  sx={{ 
                                    py: 1.5,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                  }}
                                >
                                  {loadingPdf['estudio'] ? 'Cargando...' : 'Estudio PDF'}
                                </Button>
                              </Box>
                            )}
                            {semarnatData.resolutivo && (
                              <Box>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<OpenInNewIcon />}
                                  disabled={loadingPdf['resolutivo']}
                                  onClick={async () => {
                                    setLoadingPdf(prev => ({ ...prev, resolutivo: true }))
                                    try {
                                      // Hacer petición POST para obtener el PDF
                                      const response = await fetch('/api/semarnat-pdf', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'text/plain',
                                        },
                                        body: semarnatData.resolutivo
                                      })

                                      if (response.ok) {
                                        const contentType = response.headers.get('content-type')
                                        if (contentType?.includes('application/pdf')) {
                                          // Es un PDF, crear blob y descargarlo
                                          const blob = await response.blob()
                                          const url = window.URL.createObjectURL(blob)
                                          const a = document.createElement('a')
                                          a.href = url
                                          a.download = `resolutivo_${registro?.clave_proyecto || 'documento'}.pdf`
                                          document.body.appendChild(a)
                                          a.click()
                                          window.URL.revokeObjectURL(url)
                                          document.body.removeChild(a)
                                          
                                          // Guardar información de la respuesta
                                          setPdfResponseData(prev => ({
                                            ...prev,
                                            resolutivo: { tipo: 'PDF', tamaño: blob.size, descargado: true }
                                          }))
                                        } else {
                                          // Es JSON con URL u otros datos
                                          try {
                                            const data = await response.json()
                                            setPdfResponseData(prev => ({
                                              ...prev,
                                              resolutivo: data
                                            }))
                                            if (data.url) {
                                              window.open(data.url, '_blank', 'noopener,noreferrer')
                                            }
                                          } catch {
                                            const text = await response.text()
                                            setPdfResponseData(prev => ({
                                              ...prev,
                                              resolutivo: { respuesta: text }
                                            }))
                                          }
                                        }
                                      } else {
                                        const errorText = await response.text()
                                        setPdfResponseData(prev => ({
                                          ...prev,
                                          resolutivo: { error: errorText, status: response.status }
                                        }))
                                      }
                                    } catch (error) {
                                      setPdfResponseData(prev => ({
                                        ...prev,
                                        resolutivo: { error: error instanceof Error ? error.message : 'Error desconocido' }
                                      }))
                                    } finally {
                                      setLoadingPdf(prev => ({ ...prev, resolutivo: false }))
                                    }
                                  }}
                                  sx={{ 
                                    py: 1.5,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                  }}
                                >
                                  {loadingPdf['resolutivo'] ? 'Cargando...' : 'Resolutivo PDF'}
                                </Button>
                              </Box>
                            )}
                          </Box>
                          
                          {/* Mostrar respuestas JSON de los PDFs */}
                          {Object.keys(pdfResponseData).length > 0 && (
                            <Box sx={{ mt: 3 }}>
                              <Typography
                                variant="subtitle2"
                                fontWeight="medium"
                                color="text.secondary"
                                sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                              >
                                Respuestas de las Peticiones PDF
                              </Typography>
                              {Object.entries(pdfResponseData).map(([tipo, data]) => (
                                <Box key={tipo} sx={{ mb: 2 }}>
                                  <Typography
                                    variant="caption"
                                    fontWeight="medium"
                                    sx={{ display: 'block', mb: 0.5 }}
                                  >
                                    {tipo === 'resumen' ? 'Resumen' : tipo === 'estudio' ? 'Estudio' : 'Resolutivo'}:
                                  </Typography>
                                  <Paper
                                    variant="outlined"
                                    sx={{
                                      p: 2,
                                      bgcolor: 'background.default',
                                      maxHeight: '200px',
                                      overflow: 'auto'
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      component="pre"
                                      sx={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        fontFamily: 'monospace',
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                        m: 0
                                      }}
                                    >
                                      {JSON.stringify(data, null, 2)}
                                    </Typography>
                                  </Paper>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Sin documentos disponibles
                        </Alert>
                      )}
                    </Box>
                  )}
                  
                  {/* Historial del Trámite */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      fontWeight="semibold"
                      sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      Historial del Trámite
                    </Typography>
                    
                    {loadingHistorial && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2" color="text.secondary">
                          Cargando historial...
                        </Typography>
                      </Box>
                    )}
                    
                    {errorHistorial && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        {errorHistorial}
                      </Alert>
                    )}
                    
                    {/* Mostrar historial si existe en cualquier formato */}
                    {(historialData?.historial && Array.isArray(historialData.historial) && historialData.historial.length > 0) || 
                     (Array.isArray(historialData) && historialData.length > 0) ? (
                      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: '400px' }}>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                No.
                              </TableCell>
                              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                Fecha
                              </TableCell>
                              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                Descripción de la Situación
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(historialData?.historial || (Array.isArray(historialData) ? historialData : [])).map((item: any, index: number) => (
                              <TableRow key={index} hover>
                                <TableCell sx={{ fontSize: '0.875rem', width: '60px' }}>
                                  {index + 1}
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                  {item.historialFechaTurn || item.fecha || item.historialFecha || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.875rem' }}>
                                  {item.descipcionSituacion || item.descripcion || item.situacion || item.descpicionSituacion || 'N/A'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : historialData && !errorHistorial && historialData.mensaje === 'error' && !historialData.historial ? (
                      // Solo mostrar mensaje si realmente no hay historial y mensaje es "error"
                      <Alert severity="info">
                        No hay historial disponible para este trámite.
                      </Alert>
                    ) : null}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Palabras Clave */}
            {gaceta.palabras_clave_encontradas.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Palabras Clave
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {gaceta.palabras_clave_encontradas.map((palabra, idx) => (
                    <Chip
                      key={idx}
                      label={palabra}
                      size="small"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Páginas */}
            {gaceta.paginas.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Páginas mencionadas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {gaceta.paginas.map((pagina, idx) => (
                    <Chip
                      key={idx}
                      label={`Página ${pagina}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Resumen de la Gaceta */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight="semibold"
                sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Resumen
              </Typography>
              {gaceta.resumen ? (
                <Box
                  sx={{
                    lineHeight: 1.7,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: 'text.primary',
                    '& p': {
                      margin: '0 0 1em 0',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      lineHeight: 1.7
                    },
                    '& p:last-of-type': {
                      marginBottom: 0
                    },
                    '& ul, & ol': {
                      margin: '0 0 1em 0',
                      paddingLeft: '1.5em',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    },
                    '& li': {
                      marginBottom: '0.5em',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      lineHeight: 1.7
                    },
                    '& strong': {
                      fontWeight: 600
                    },
                    '& em': {
                      fontStyle: 'italic'
                    },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      margin: '1em 0 0.5em 0',
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    },
                    '& h1:first-of-type, & h2:first-of-type, & h3:first-of-type, & h4:first-of-type, & h5:first-of-type, & h6:first-of-type': {
                      marginTop: 0
                    }
                  }}
                >
                  <ReactMarkdown>{gaceta.resumen}</ReactMarkdown>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic' }}
                >
                  Sin resumen disponible
                </Typography>
              )}
            </Box>
          </Box>

          {/* Floating Button */}
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              p: 2,
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
              zIndex: 20,
              boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<OpenInNewIcon />}
              onClick={() => window.open(gaceta.url, '_blank', 'noopener,noreferrer')}
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              Consultar Gaceta Original
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

