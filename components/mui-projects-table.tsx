"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  CircularProgress,
  Button,
  IconButton,
  Tooltip
} from "@mui/material"
import { FilterList, Clear } from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { MapModal } from "./map-modal"
import { BoletinModal } from "./boletin-modal"
import { useBoletinModal } from "@/hooks/useBoletinModal"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: '1px solid rgba(30, 58, 138, 0.1)',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}))

interface Proyecto {
  numero: number
  tipo_estudio: string
  promovente: string
  nombre_proyecto: string
  giro: string
  municipio: string
  coordenadas_x: number | null
  coordenadas_y: number | null
  expediente: string
  fecha_ingreso: string
  boletin_id: number
  coord_valida: boolean | null
  naturaleza_proyecto: string
  fecha_publicacion: string
  boletin_url: string
}

interface Resolutivo {
  numero: number
  tipo_estudio: string
  promovente: string
  nombre_proyecto: string
  giro: string
  municipio: string
  coordenadas_x: number | null
  coordenadas_y: number | null
  expediente: string
  fecha_ingreso: string
  fecha_resolutivo: string
  no_oficio_resolutivo: string
  boletin_id: number
  naturaleza_proyecto: string
  fecha_publicacion: string
  boletin_url: string
  boletin_ingreso_url: string | null
}

interface MuiProjectsTableProps {
  proyectos: Proyecto[]
  resolutivos: Resolutivo[]
  municipios: string[]
  giros: string[]
  tiposEstudio: string[]
  selectedDate?: string | null
  highlightExpediente?: string
}

export function MuiProjectsTable({ proyectos, resolutivos, municipios, giros, tiposEstudio, selectedDate, highlightExpediente }: MuiProjectsTableProps) {
  const [activeTab, setActiveTab] = useState<"proyectos" | "resolutivos">("proyectos")
  const [search, setSearch] = useState("")
  const [municipioFilter, setMunicipioFilter] = useState<string>("all")
  const [giroFilter, setGiroFilter] = useState<string>("all")
  const [tipoFilter, setTipoFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [monthFilter, setMonthFilter] = useState<string>("all")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Estados para paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  
  // Estados para modal de ubicación
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [highlight, setHighlight] = useState<string | null>(null)
  
  // Hook para modal de boletín con routing
  const { isOpen: isBoletinModalOpen, selectedBoletin, openModal: openBoletinModal, closeModal: closeBoletinModal } = useBoletinModal()

  // Estado para almacenar datos de boletines
  const [boletinesData, setBoletinesData] = useState<any[]>([])
  const [boletinesLoaded, setBoletinesLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Evitar hidratación: solo renderizar contenido dependiente de datos asíncronos después de montar
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar datos de boletines al montar el componente
  useEffect(() => {
    if (!mounted) return
    
    const loadBoletines = async () => {
      try {
        const response = await fetch('/data/boletines.json')
        const data = await response.json()
        setBoletinesData(data.boletines || [])
        setBoletinesLoaded(true)
      } catch (error) {
        console.error('Error cargando datos de boletines:', error)
        setBoletinesLoaded(true) // Marcar como cargado incluso si hay error
      }
    }
    loadBoletines()
  }, [mounted])

  // Función para formatear fecha de manera consistente (sin depender de localización del servidor)
  const formatFecha = (fechaStr: string): string => {
    if (!fechaStr) return 'Sin fecha'
    
    try {
      const fecha = new Date(fechaStr)
      if (isNaN(fecha.getTime())) return 'Sin fecha'
      
      // Formatear de manera consistente sin depender de localización
      const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
      const dia = fecha.getDate()
      const mes = meses[fecha.getMonth()]
      const año = fecha.getFullYear()
      
      return `${dia} ${mes} ${año}`
    } catch {
      return 'Sin fecha'
    }
  }

  // Función para obtener el resumen del boletín
  const getBoletinResumen = (boletinId: number): string => {
    // Durante SSR o antes de que se monte el componente, devolver un placeholder consistente
    // para evitar diferencias entre servidor y cliente
    if (!mounted || !boletinesLoaded) {
      return 'Cargando...'
    }
    
    const boletin = boletinesData.find((b: any) => b.id === boletinId)
    if (!boletin) return 'Boletín no encontrado'
    
    const fecha = formatFecha(boletin.fecha_publicacion)
    const proyectos = boletin.cantidad_ingresados || 0
    const resolutivos = boletin.cantidad_resolutivos || 0
    
    return `${fecha} • ${proyectos} proyectos • ${resolutivos} resolutivos`
  }

  // Función para obtener el boletín completo
  const getBoletin = (boletinId: number) => {
    if (!mounted || !boletinesLoaded) return null
    return boletinesData.find((b: any) => b.id === boletinId)
  }

  // Aplicar filtros externos cuando cambien
  useEffect(() => {
    if (selectedDate) {
      const fecha = new Date(selectedDate)
      const year = fecha.getFullYear().toString()
      const month = (fecha.getMonth() + 1).toString()
      setYearFilter(year)
      setMonthFilter(month)
      setMunicipioFilter("all")
      setGiroFilter("all")
      setTipoFilter("all")
    }
  }, [selectedDate])

  // Resaltar y filtrar desde el mapa
  useEffect(() => {
    if (!highlightExpediente || typeof highlightExpediente !== 'string') return
    setActiveTab("proyectos")
    // Filtrar por expediente (similar a buscar por expediente)
    setSearch(highlightExpediente)
    // Limpiar otros filtros para mostrar solo el registro
    setMunicipioFilter("all")
    setGiroFilter("all")
    setTipoFilter("all")
    setYearFilter("all")
    setMonthFilter("all")
    setHighlight(highlightExpediente)
    // Resetear a la primera página ya que solo habrá un resultado
    setPage(0)
    // Scroll suave al render
    setTimeout(() => {
      const el = document.getElementById(`row-${highlightExpediente}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }, [highlightExpediente])

  const handleRowClick = (item: any) => {
    if (item.coordenadas_x && item.coordenadas_y) {
      setSelectedItem(item)
      setIsMapModalOpen(true)
    }
  }

  const sortByDate = (items: any[]) => {
    return [...items].sort((a, b) => {
      if (!a.fecha_ingreso && !b.fecha_ingreso) return 0
      if (!a.fecha_ingreso) return 1
      if (!b.fecha_ingreso) return -1
      try {
        const dateA = new Date(a.fecha_ingreso.split("/").reverse().join("-"))
        const dateB = new Date(b.fecha_ingreso.split("/").reverse().join("-"))
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0
        return dateB.getTime() - dateA.getTime()
      } catch {
        return 0
      }
    })
  }

  const filteredProyectos = useMemo(() => {
    if (!proyectos || !Array.isArray(proyectos)) return []
    const filtered = proyectos.filter(proyecto => {
      const nombreProyecto = proyecto.nombre_proyecto || ''
      const municipio = proyecto.municipio || ''
      const giro = proyecto.giro || ''
      const expediente = proyecto.expediente || ''
      const promovente = proyecto.promovente || ''
      const tipoEstudio = proyecto.tipo_estudio || ''

      const matchesSearch = nombreProyecto.toLowerCase().includes(search.toLowerCase()) ||
                           municipio.toLowerCase().includes(search.toLowerCase()) ||
                           giro.toLowerCase().includes(search.toLowerCase()) ||
                           expediente.toLowerCase().includes(search.toLowerCase()) ||
                           promovente.toLowerCase().includes(search.toLowerCase())

      const matchesMunicipio = municipioFilter === "all" || municipio === municipioFilter
      const matchesGiro = giroFilter === "all" || giro === giroFilter
      const matchesTipo = tipoFilter === "all" || tipoEstudio === tipoFilter
      
      let matchesYear = true
      let matchesMonth = true
      
      if (yearFilter !== "all" && proyecto.fecha_ingreso) {
        try {
          const fechaIngreso = new Date(proyecto.fecha_ingreso)
          if (!isNaN(fechaIngreso.getTime())) {
            matchesYear = fechaIngreso.getFullYear().toString() === yearFilter
          }
        } catch {
          matchesYear = false
        }
      }
      
      if (monthFilter !== "all" && proyecto.fecha_ingreso) {
        try {
          const fechaIngreso = new Date(proyecto.fecha_ingreso)
          if (!isNaN(fechaIngreso.getTime())) {
            matchesMonth = (fechaIngreso.getMonth() + 1).toString() === monthFilter
          }
        } catch {
          matchesMonth = false
        }
      }

      return matchesSearch && matchesMunicipio && matchesGiro && matchesTipo && matchesYear && matchesMonth
    })
    return sortByDate(filtered)
  }, [proyectos, search, municipioFilter, giroFilter, tipoFilter, yearFilter, monthFilter])

  const filteredResolutivos = useMemo(() => {
    if (!resolutivos || !Array.isArray(resolutivos)) return []
    const filtered = resolutivos.filter(resolutivo => {
      const noOficio = resolutivo.no_oficio_resolutivo || ''
      const nombreProyecto = resolutivo.nombre_proyecto || ''
      const expediente = resolutivo.expediente || ''
      const promovente = resolutivo.promovente || ''
      const municipio = resolutivo.municipio || ''
      const giro = resolutivo.giro || ''
      const tipoEstudio = resolutivo.tipo_estudio || ''

      const matchesSearch = noOficio.toLowerCase().includes(search.toLowerCase()) ||
                           nombreProyecto.toLowerCase().includes(search.toLowerCase()) ||
                           expediente.toLowerCase().includes(search.toLowerCase()) ||
                           promovente.toLowerCase().includes(search.toLowerCase())

      const matchesMunicipio = municipioFilter === "all" || municipio === municipioFilter
      const matchesGiro = giroFilter === "all" || giro === giroFilter
      const matchesTipo = tipoFilter === "all" || tipoEstudio === tipoFilter
      
      let matchesYear = true
      let matchesMonth = true
      
      if (yearFilter !== "all" && resolutivo.fecha_ingreso) {
        try {
          const fechaIngreso = new Date(resolutivo.fecha_ingreso)
          if (!isNaN(fechaIngreso.getTime())) {
            matchesYear = fechaIngreso.getFullYear().toString() === yearFilter
          }
        } catch {
          matchesYear = false
        }
      }
      
      if (monthFilter !== "all" && resolutivo.fecha_ingreso) {
        try {
          const fechaIngreso = new Date(resolutivo.fecha_ingreso)
          if (!isNaN(fechaIngreso.getTime())) {
            matchesMonth = (fechaIngreso.getMonth() + 1).toString() === monthFilter
          }
        } catch {
          matchesMonth = false
        }
      }

      return matchesSearch && matchesMunicipio && matchesGiro && matchesTipo && matchesYear && matchesMonth
    })
    return sortByDate(filtered)
  }, [resolutivos, search, municipioFilter, giroFilter, tipoFilter, yearFilter, monthFilter])

  const handleTabChange = (event: React.SyntheticEvent, newValue: "proyectos" | "resolutivos") => {
    setActiveTab(newValue)
    setPage(0)
  }
  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0) }

  const clearFilters = () => {
    setSearch("")
    setMunicipioFilter("all")
    setGiroFilter("all")
    setTipoFilter("all")
    setYearFilter("all")
    setMonthFilter("all")
    setPage(0)
    setShowMobileFilters(false)
  }

  const getAvailableYears = () => {
    const allItems = activeTab === "proyectos" ? proyectos : resolutivos
    const years = new Set<string>()
    allItems.forEach(item => {
      if (item.fecha_ingreso) {
        const year = new Date(item.fecha_ingreso).getFullYear()
        if (!isNaN(year)) years.add(year.toString())
      }
    })
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
  }

  const getAvailableMonths = () => ([
    { value: "1", label: "Enero" }, { value: "2", label: "Febrero" }, { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" }, { value: "5", label: "Mayo" }, { value: "6", label: "Junio" },
    { value: "7", label: "Julio" }, { value: "8", label: "Agosto" }, { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" }, { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" }
  ])

  const paginatedProyectos = useMemo(() => {
    const startIndex = page * rowsPerPage
    return filteredProyectos.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredProyectos, page, rowsPerPage])

  const paginatedResolutivos = useMemo(() => {
    const startIndex = page * rowsPerPage
    return filteredResolutivos.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredResolutivos, page, rowsPerPage])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'autorizado':
        return 'success'
      case 'en proceso':
        return 'warning'
      case 'rechazado':
        return 'error'
      default:
        return 'default'
    }
  }

  if (!proyectos || !resolutivos || !Array.isArray(proyectos) || !Array.isArray(resolutivos)) {
    return (
      <StyledCard elevation={0}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" component="h3" fontWeight="semibold" color="text.primary">
            Proyectos y Resolutivos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No hay datos disponibles para mostrar
          </Typography>
        </CardContent>
      </StyledCard>
    )
  }

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
              Tabla de proyectos ingresados y resolutivos emitidos
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: { xs: 0.5, sm: 0.5 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Explora los proyectos ambientales y sus resolutivos correspondientes
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="proyectos y resolutivos tabs">
              <Tab label={`Proyectos (${filteredProyectos.length})`} value="proyectos" />
              <Tab label={`Resolutivos (${filteredResolutivos.length})`} value="resolutivos" />
            </Tabs>
          </Box>

          {/* Filtros */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
            {/* Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <TextField 
                label="Buscar" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                size="small" 
                placeholder="Buscar..." 
                sx={{ minWidth: 200 }} 
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Municipio</InputLabel>
                <Select value={municipioFilter} label="Municipio" onChange={(e) => setMunicipioFilter(e.target.value)}>
                  <MenuItem value="all">Todos</MenuItem>
                  {municipios.map(municipio => (<MenuItem key={municipio} value={municipio}>{municipio}</MenuItem>))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Giro</InputLabel>
                <Select value={giroFilter} label="Giro" onChange={(e) => setGiroFilter(e.target.value)}>
                  <MenuItem value="all">Todos</MenuItem>
                  {giros.map(giro => (<MenuItem key={giro} value={giro}>{giro}</MenuItem>))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Tipo Estudio</InputLabel>
                <Select value={tipoFilter} label="Tipo Estudio" onChange={(e) => setTipoFilter(e.target.value)}>
                  <MenuItem value="all">Todos</MenuItem>
                  {tiposEstudio.map(tipo => (<MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Año</InputLabel>
                <Select value={yearFilter} label="Año" onChange={(e) => setYearFilter(e.target.value)}>
                  <MenuItem value="all">Todos</MenuItem>
                  {getAvailableYears().map(year => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Mes</InputLabel>
                <Select value={monthFilter} label="Mes" onChange={(e) => setMonthFilter(e.target.value)}>
                  <MenuItem value="all">Todos</MenuItem>
                  {getAvailableMonths().map(month => (<MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>))}
                </Select>
              </FormControl>
              <Button variant="contained" color="error" onClick={clearFilters} size="small" sx={{ minWidth: 'auto', px: 2, height: '40px' }}>Limpiar</Button>
            </Box>

            {/* Mobile */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <TextField 
                label="Buscar" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                size="small" 
                placeholder="Buscar..." 
                sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }} 
              />
              <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, mt: { xs: 1, sm: 0 } }}>
                <IconButton 
                  onClick={() => setShowMobileFilters(!showMobileFilters)} 
                  color="primary" 
                  sx={{ 
                    border: '1px solid', 
                    borderColor: 'primary.main', 
                    borderRadius: 1,
                    flex: { xs: 1, sm: 'none' }
                  }}
                >
                  <FilterList />
                </IconButton>
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={clearFilters} 
                  size="small" 
                  sx={{ 
                    minWidth: 'auto', 
                    px: { xs: 2, sm: 2 }, 
                    height: '40px',
                    flex: { xs: 1, sm: 'none' }
                  }}
                >
                  Limpiar
                </Button>
              </Box>
            </Box>

            {showMobileFilters && (
              <Box sx={{ 
                display: { xs: 'block', md: 'none' }, 
                p: { xs: 1.5, sm: 2 }, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 1, 
                bgcolor: 'background.paper' 
              }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: { xs: 1.5, sm: 2 } }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Municipio</InputLabel>
                    <Select value={municipioFilter} label="Municipio" onChange={(e) => setMunicipioFilter(e.target.value)}>
                      <MenuItem value="all">Todos</MenuItem>
                      {municipios.map(municipio => (<MenuItem key={municipio} value={municipio}>{municipio}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Giro</InputLabel>
                    <Select value={giroFilter} label="Giro" onChange={(e) => setGiroFilter(e.target.value)}>
                      <MenuItem value="all">Todos</MenuItem>
                      {giros.map(giro => (<MenuItem key={giro} value={giro}>{giro}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tipo Estudio</InputLabel>
                    <Select value={tipoFilter} label="Tipo Estudio" onChange={(e) => setTipoFilter(e.target.value)}>
                      <MenuItem value="all">Todos</MenuItem>
                      {tiposEstudio.map(tipo => (<MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Año</InputLabel>
                    <Select value={yearFilter} label="Año" onChange={(e) => setYearFilter(e.target.value)}>
                      <MenuItem value="all">Todos</MenuItem>
                      {getAvailableYears().map(year => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Mes</InputLabel>
                    <Select value={monthFilter} label="Mes" onChange={(e) => setMonthFilter(e.target.value)}>
                      <MenuItem value="all">Todos</MenuItem>
                      {getAvailableMonths().map(month => (<MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
          </Box>

          {/* Tabla */}
          <TableContainer 
            component={Paper} 
            elevation={0} 
            sx={{ 
              border: '1px solid rgba(0, 0, 0, 0.1)',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <Table sx={{ minWidth: { xs: 800, md: 'auto' } }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(30, 58, 138, 0.05)' }}>
                  {activeTab === "proyectos" ? (
                    <>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Expediente</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, minWidth: { xs: 150, sm: 'auto' } }}>Nombre del Proyecto</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, maxWidth: { xs: 100, sm: 150, md: 180 } }}>Promovente</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Municipio</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, maxWidth: { xs: 80, sm: 120, md: 150 }, whiteSpace: 'nowrap' }}>Giro</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, maxWidth: { xs: 100, sm: 140, md: 180 }, whiteSpace: 'nowrap' }}>Tipo Estudio</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Fecha Ingreso</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Ubicación</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Resumen del Boletín</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Boletín</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>No. Oficio</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Expediente</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, minWidth: { xs: 150, sm: 'auto' } }}>Nombre del Proyecto</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, maxWidth: { xs: 100, sm: 150, md: 180 } }}>Promovente</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Fecha Ingreso</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Fecha Resolutivo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Municipio</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Ubicación</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Resumen del Boletín</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Boletín Ingreso</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Boletín</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {activeTab === "proyectos" ? (
                  paginatedProyectos.map((proyecto) => (
                    <TableRow 
                      key={`${proyecto.expediente || 'unknown'}-${proyecto.boletin_id || 'unknown'}`} 
                      id={`row-${proyecto.expediente}`}
                      hover
                      onClick={() => handleRowClick(proyecto)}
                      sx={{ 
                        cursor: proyecto.coordenadas_x && proyecto.coordenadas_y ? 'pointer' : 'default',
                        '&:hover': { backgroundColor: proyecto.coordenadas_x && proyecto.coordenadas_y ? 'rgba(0, 0, 0, 0.04)' : 'inherit' },
                        backgroundColor: highlight === proyecto.expediente ? 'rgba(246, 150, 80, 0.18)' : 'inherit',
                        outline: highlight === proyecto.expediente ? '2px solid rgba(2, 57, 35, 0.35)' : 'none'
                      }}
                    >
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{proyecto.expediente || 'N/A'}</TableCell>
                      <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                        maxWidth: { xs: 150, sm: 'none' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {proyecto.nombre_proyecto || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                        maxWidth: { xs: 100, sm: 150, md: 180 },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {proyecto.promovente || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{proyecto.municipio || 'N/A'}</TableCell>
                      <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                        maxWidth: { xs: 80, sm: 120, md: 150 },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {proyecto.giro || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                        maxWidth: { xs: 100, sm: 140, md: 180 },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {proyecto.tipo_estudio || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{proyecto.fecha_ingreso || 'N/A'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                        {proyecto.coordenadas_x && proyecto.coordenadas_y ? (
                          <Chip label="📍 Ver ubicación" size="small" color="primary" variant="outlined" sx={{ cursor: 'pointer', fontSize: { xs: '0.65rem', sm: '0.75rem' } }} />
                        ) : (
                          <Chip label="Sin coordenadas" size="small" variant="outlined" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }} />
                        )}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontSize: { xs: '0.7rem', sm: '0.875rem' }, 
                          maxWidth: { xs: 200, sm: 300 },
                          cursor: 'pointer',
                          color: 'primary.main',
                          '&:hover': { 
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          const boletin = getBoletin(proyecto.boletin_id)
                          if (boletin) {
                            openBoletinModal(boletin)
                          }
                        }}
                      >
                        <Tooltip title="Haz clic para ver el resumen completo del boletín" arrow>
                          <Box component="span" sx={{ display: 'block' }}>
                            {getBoletinResumen(proyecto.boletin_id)}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                        {proyecto.boletin_url && (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="primary" 
                            onClick={(e) => { e.stopPropagation(); window.open(proyecto.boletin_url, '_blank', 'noopener,noreferrer') }} 
                            sx={{ 
                              minWidth: 'auto', 
                              px: { xs: 0.5, sm: 1 },
                              fontSize: { xs: '0.65rem', sm: '0.875rem' }
                            }}
                          >
                            {isMobile ? '📄' : '📄 Ver'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  paginatedResolutivos.map((resolutivo) => (
                    <TableRow 
                      key={`${resolutivo.no_oficio_resolutivo || 'unknown'}-${resolutivo.boletin_id || 'unknown'}`} 
                      hover
                      onClick={() => handleRowClick(resolutivo)}
                      sx={{ 
                        cursor: resolutivo.coordenadas_x && resolutivo.coordenadas_y ? 'pointer' : 'default',
                        '&:hover': { backgroundColor: resolutivo.coordenadas_x && resolutivo.coordenadas_y ? 'rgba(0, 0, 0, 0.04)' : 'inherit' }
                      }}
                    >
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{resolutivo.no_oficio_resolutivo || 'N/A'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{resolutivo.expediente || 'N/A'}</TableCell>
                      <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                        maxWidth: { xs: 150, sm: 'none' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {resolutivo.nombre_proyecto || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                        maxWidth: { xs: 100, sm: 150, md: 180 },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {resolutivo.promovente || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{resolutivo.fecha_ingreso || 'N/A'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{resolutivo.fecha_resolutivo || 'N/A'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{resolutivo.municipio || 'N/A'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                        {resolutivo.coordenadas_x && resolutivo.coordenadas_y ? (
                          <Chip label="📍 Ver ubicación" size="small" color="primary" variant="outlined" sx={{ cursor: 'pointer', fontSize: { xs: '0.65rem', sm: '0.75rem' } }} />
                        ) : (
                          <Chip label="Sin coordenadas" size="small" variant="outlined" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }} />
                        )}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontSize: { xs: '0.7rem', sm: '0.875rem' }, 
                          maxWidth: { xs: 200, sm: 300 },
                          cursor: 'pointer',
                          color: 'primary.main',
                          '&:hover': { 
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          const boletin = getBoletin(resolutivo.boletin_id)
                          if (boletin) {
                            openBoletinModal(boletin)
                          }
                        }}
                      >
                        <Tooltip title="Haz clic para ver el resumen completo del boletín" arrow>
                          <Box component="span" sx={{ display: 'block' }}>
                            {getBoletinResumen(resolutivo.boletin_id)}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                        {resolutivo.boletin_ingreso_url ? (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="success" 
                            onClick={(e) => { e.stopPropagation(); window.open(resolutivo.boletin_ingreso_url, '_blank', 'noopener,noreferrer') }} 
                            sx={{ 
                              minWidth: 'auto', 
                              px: { xs: 0.5, sm: 1 },
                              fontSize: { xs: '0.65rem', sm: '0.875rem' }
                            }}
                          >
                            {isMobile ? '📄' : '📄 Ingreso'}
                          </Button>
                        ) : (
                          <Chip label="Sin URL" size="small" variant="outlined" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }} />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                        {resolutivo.boletin_url && (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="primary" 
                            onClick={(e) => { e.stopPropagation(); window.open(resolutivo.boletin_url, '_blank', 'noopener,noreferrer') }} 
                            sx={{ 
                              minWidth: 'auto', 
                              px: { xs: 0.5, sm: 1 },
                              fontSize: { xs: '0.65rem', sm: '0.875rem' }
                            }}
                          >
                            {isMobile ? '📄' : '📄 Ver'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={activeTab === "proyectos" ? filteredProyectos.length : filteredResolutivos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
            sx={{
              '& .MuiTablePagination-toolbar': {
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 0 }
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
      </CardContent>
      {selectedItem && (
        <MapModal
          coordenadas_x={selectedItem.coordenadas_x}
          coordenadas_y={selectedItem.coordenadas_y}
          expediente={selectedItem.expediente}
          nombre_proyecto={selectedItem.nombre_proyecto || 'Sin nombre'}
          municipio={selectedItem.municipio}
          promovente={selectedItem.promovente}
          fecha_ingreso={selectedItem.fecha_ingreso}
          naturaleza_proyecto={selectedItem.naturaleza_proyecto}
          boletin_url={selectedItem.boletin_url}
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
        />
      )}
      <BoletinModal boletin={selectedBoletin} isOpen={isBoletinModalOpen} onClose={closeBoletinModal} />
    </StyledCard>
  )
}


