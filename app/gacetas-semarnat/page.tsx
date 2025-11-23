"use client"

import { useState, useEffect, useMemo } from "react"
import { Box, Container, Typography, Paper, CircularProgress, Alert, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, TextField, InputAdornment, Card, CardContent, Button } from "@mui/material"
import ReactMarkdown from "react-markdown"
import { MuiGacetasStats } from "@/components/mui-gacetas-stats"
import { ErrorBoundary } from "@/components/error-boundary"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MuiThemeProvider } from "@/components/mui-theme-provider"
import { useGacetasData } from "@/hooks/useGacetasData"
import { GacetaModal } from "@/components/gaceta-modal"
import SearchIcon from "@mui/icons-material/Search"
import VisibilityIcon from "@mui/icons-material/Visibility"

function GacetasSEMARNATPageContent() {
  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGaceta, setSelectedGaceta] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { processedData, loading, error, data } = useGacetasData()

  // Evitar SSR para prevenir hydration mismatch (MUI/emotion)
  useEffect(() => { setMounted(true) }, [])

  // Extraer datos de forma segura (puede ser null)
  const stats = processedData?.stats
  const timeSeriesData = processedData?.timeSeriesData || []
  const gacetas = processedData?.gacetas || []
  const metadata = processedData?.metadata
  
  // Obtener año de los datos
  const year = data?.metadata?.year || new Date().getFullYear()

  // Filtrar gacetas según búsqueda - debe estar antes de returns
  const filteredGacetas = useMemo(() => {
    if (!gacetas || gacetas.length === 0) return []
    if (!searchQuery.trim()) return gacetas
    
    const query = searchQuery.toLowerCase()
    return gacetas.filter(gaceta => 
      gaceta.resumen?.toLowerCase().includes(query) ||
      gaceta.url.toLowerCase().includes(query) ||
      gaceta.fecha_publicacion.includes(query) ||
      gaceta.palabras_clave_encontradas.some(p => p.toLowerCase().includes(query))
    )
  }, [gacetas, searchQuery])

  // Paginación - debe estar antes de returns
  const paginatedGacetas = useMemo(() => {
    const start = page * rowsPerPage
    return filteredGacetas.slice(start, start + rowsPerPage)
  }, [filteredGacetas, page, rowsPerPage])


  // Handlers - funciones normales, no hooks
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenModal = (gaceta: any) => {
    setSelectedGaceta(gaceta)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedGaceta(null)
  }

  // Ahora sí, los returns condicionales
  if (!mounted) {
    return null
  }

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <CircularProgress size={60} sx={{ color: 'primary.main', mb: 3 }} />
          <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
            Cargando datos de gacetas...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error || !processedData || !stats) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Error al cargar los datos
          </Typography>
          <Typography variant="body2">
            {error || "No se pudieron cargar los datos de gacetas. Por favor, intenta de nuevo más tarde."}
          </Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      
      {/* Dashboard Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          mt: { xs: '64px', sm: '80px' }, 
          bgcolor: 'background.paper',
          borderRadius: 0
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="bold" 
                color="text.primary"
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                  lineHeight: { xs: 1.3, sm: 1.4 }
                }}
              >
          Gacetas Ecológicas SEMARNAT
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                sx={{ 
                  mt: { xs: 0.5, sm: 0.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: { xs: 1.5, sm: 1.6 }
                }}
              >
                Visualización interactiva de las gacetas ecológicas publicadas por la Secretaría de Medio Ambiente y Recursos Naturales (SEMARNAT) en:
              </Typography>
              <Link 
                href="https://www.semarnat.gob.mx/gobmx/transparencia/gaceta.html" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  display: 'inline-block',
                  mt: { xs: 0.5, sm: 0.5 },
                  wordBreak: 'break-all'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  color="primary" 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    textDecoration: 'underline'
                  }}
                >
                  https://www.semarnat.gob.mx/gobmx/transparencia/gaceta.html
                </Typography>
              </Link>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3, md: 4 } }}>

          {/* Stats Cards */}
          <ErrorBoundary>
            <MuiGacetasStats
              totalGacetas={stats.totalGacetas}
              municipios={stats.municipios.length}
              year={year}
            />
          </ErrorBoundary>

          {/* Fecha de actualización */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 3 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid rgba(30, 58, 138, 0.1)'
          }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                textAlign: 'center',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: { xs: 1.4, sm: 1.5 }
              }}
            >
              Última actualización: {(() => {
                try {
                  if (!metadata?.lastUpdated) return 'Fecha no disponible'
                  const date = new Date(metadata.lastUpdated)
                  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
                  const day = date.getDate()
                  const month = monthNames[date.getMonth()]
                  const year = date.getFullYear()
                  return `${day} de ${month} de ${year}`
                } catch {
                  return 'Fecha no disponible'
                }
              })()}
            </Typography>
          </Box>

          {/* Gacetas Table */}
          <ErrorBoundary>
            <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid rgba(30, 58, 138, 0.1)' }}>
              <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    fontWeight="semibold" 
                    color="text.primary"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mb: 1 }}
                  >
                    Gacetas Analizadas
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Lista de gacetas ecológicas con análisis de contenido
                  </Typography>
                </Box>

                {/* Search */}
                <TextField
                  fullWidth
                  placeholder="Buscar por resumen, URL, fecha o palabras clave..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(0)
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                {/* Table - Desktop */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <TableContainer sx={{ maxHeight: '600px', overflowX: 'auto' }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', minWidth: 120 }}>
                            Fecha
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', minWidth: 200 }}>
                            URL
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', minWidth: 300 }}>
                            Resumen
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', minWidth: 150 }}>
                            Palabras Clave
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', width: 120 }}>
                            Acciones
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedGacetas.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                No se encontraron gacetas que coincidan con la búsqueda
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedGacetas.map((gaceta, index) => (
                            <TableRow 
                              key={`${gaceta.url}-${index}`} 
                              hover
                              onClick={() => handleOpenModal(gaceta)}
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'action.hover' }
                              }}
                            >
                              <TableCell sx={{ fontSize: '0.875rem' }}>
                                {new Date(gaceta.fecha_publicacion).toLocaleDateString('es-MX', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </TableCell>
                              <TableCell>
                                <Link 
                                  href={gaceta.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  sx={{ 
                                    wordBreak: 'break-all',
                                    fontSize: '0.875rem',
                                    color: 'primary.main',
                                    '&:hover': { textDecoration: 'underline' }
                                  }}
                                >
                                  Ver gaceta
                                </Link>
                              </TableCell>
                              <TableCell sx={{ maxWidth: 400 }}>
                                <Box
                                  sx={{ 
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    '& p': {
                                      margin: 0,
                                      fontSize: '0.875rem',
                                      lineHeight: 1.5
                                    },
                                    '& ul, & ol': {
                                      margin: 0,
                                      paddingLeft: '1.2em',
                                      fontSize: '0.875rem'
                                    },
                                    '& li': {
                                      fontSize: '0.875rem',
                                      lineHeight: 1.5
                                    },
                                    '& strong': {
                                      fontWeight: 600
                                    }
                                  }}
                                >
                                  {gaceta.resumen ? (
                                    <ReactMarkdown>{gaceta.resumen}</ReactMarkdown>
                                  ) : (
                                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                      Sin resumen disponible
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {gaceta.palabras_clave_encontradas.slice(0, 2).map((palabra, idx) => (
                                    <Chip 
                                      key={idx}
                                      label={palabra}
                                      size="small"
                                      sx={{ fontSize: '0.75rem' }}
                                    />
                                  ))}
                                  {gaceta.palabras_clave_encontradas.length > 2 && (
                                    <Chip 
                                      label={`+${gaceta.palabras_clave_encontradas.length - 2}`}
                                      size="small"
                                      sx={{ fontSize: '0.75rem' }}
                                    />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<VisibilityIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenModal(gaceta)
                                  }}
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  Ver
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Cards - Mobile */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  {paginatedGacetas.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No se encontraron gacetas que coincidan con la búsqueda
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {paginatedGacetas.map((gaceta, index) => (
                        <Card 
                          key={`${gaceta.url}-${index}`} 
                          elevation={0} 
                          onClick={() => handleOpenModal(gaceta)}
                          sx={{ 
                            border: '1px solid rgba(30, 58, 138, 0.1)', 
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': { 
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                              borderColor: 'primary.main'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                  {new Date(gaceta.fecha_publicacion).toLocaleDateString('es-MX', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </Typography>
                              </Box>
                              
                              <Box
                                sx={{ 
                                  fontSize: '0.875rem',
                                  lineHeight: 1.6,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  '& p': {
                                    margin: 0,
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6
                                  },
                                  '& ul, & ol': {
                                    margin: 0,
                                    paddingLeft: '1.2em',
                                    fontSize: '0.875rem'
                                  },
                                  '& li': {
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6
                                  },
                                  '& strong': {
                                    fontWeight: 600
                                  }
                                }}
                              >
                                {gaceta.resumen ? (
                                  <ReactMarkdown>{gaceta.resumen}</ReactMarkdown>
                                ) : (
                                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                    Sin resumen disponible
                                  </Typography>
                                )}
                              </Box>

                              {gaceta.palabras_clave_encontradas.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {gaceta.palabras_clave_encontradas.slice(0, 3).map((palabra, idx) => (
                                    <Chip 
                                      key={idx}
                                      label={palabra}
                                      size="small"
                                      sx={{ fontSize: '0.65rem', height: 20 }}
                                    />
                                  ))}
                                  {gaceta.palabras_clave_encontradas.length > 3 && (
                                    <Chip 
                                      label={`+${gaceta.palabras_clave_encontradas.length - 3}`}
                                      size="small"
                                      sx={{ fontSize: '0.65rem', height: 20 }}
                                    />
                                  )}
                                </Box>
                              )}

                              <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<VisibilityIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenModal(gaceta)
                                  }}
                                  sx={{ fontSize: '0.75rem', flex: 1 }}
                                >
                                  Ver Resumen
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  href={gaceta.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  sx={{ fontSize: '0.75rem', flex: 1 }}
                                >
                                  Ver Gaceta
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Pagination */}
                <TablePagination
                  component="div"
                  count={filteredGacetas.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                  sx={{ 
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    mt: 2,
                    '& .MuiTablePagination-toolbar': {
                      flexWrap: 'wrap',
                      gap: 1,
                      px: { xs: 0, sm: 2 }
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }
                  }}
                />

                {/* Iframe de Notion */}
                <Box sx={{ 
                  mt: 4,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid rgba(30, 58, 138, 0.1)',
                  width: '100%'
                }}>
                  <iframe 
                    src="https://adnags.notion.site/ebd/29c2b8101e5c80fdbd89f8c03728e80d" 
                    width="100%" 
                    height="900"
                    frameBorder="0"
                    allowFullScreen
                    scrolling="no"
                    style={{ 
                      display: 'block',
                      minHeight: '600px',
                      overflow: 'hidden'
                    }}
                    title="Formulario de suscripción al boletín semanal"
                  />
                </Box>
              </Box>
            </Paper>
          </ErrorBoundary>
        </Box>
      </Container>

      <Footer />

      {/* Modal de Gaceta */}
      <GacetaModal
        gaceta={selectedGaceta}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Box>
  )
}

export default function GacetasSEMARNATPage() {
  return (
    <MuiThemeProvider>
      <GacetasSEMARNATPageContent />
    </MuiThemeProvider>
  )
}

