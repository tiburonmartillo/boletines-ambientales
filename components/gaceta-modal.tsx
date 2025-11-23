"use client"

import { useEffect } from 'react'
import { Box, Typography, Button, IconButton, Paper, Divider, Chip } from "@mui/material"
import ReactMarkdown from "react-markdown"
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

interface GacetaAnalysis {
  url: string
  fecha_publicacion: string
  palabras_clave_encontradas: string[]
  paginas: number[]
  resumen: string | null
}

interface GacetaModalProps {
  gaceta: GacetaAnalysis | null
  isOpen: boolean
  onClose: () => void
}

export function GacetaModal({ gaceta, isOpen, onClose }: GacetaModalProps) {
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

  if (!gaceta || !isOpen) return null

  const fechaFormateada = new Date(gaceta.fecha_publicacion).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
              Gaceta Ecológica SEMARNAT
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

            {/* Resumen */}
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

