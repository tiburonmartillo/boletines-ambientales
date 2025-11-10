"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  Card, 
  Text, 
  Flex, 
  Heading,
  Box,
  Tabs,
  Select,
  Table,
  Button,
  Badge,
  IconButton,
  Tooltip,
  Spinner,
  Separator
} from "@radix-ui/themes"
import { Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { MapModal } from "./map-modal"
import { BoletinModal } from "./boletin-modal"
import { useBoletinModal } from "@/hooks/useBoletinModal"

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

interface ProjectsTableRadixProps {
  proyectos: Proyecto[]
  resolutivos: Resolutivo[]
  municipios: string[]
  giros: string[]
  tiposEstudio: string[]
  selectedDate?: string | null
  highlightExpediente?: string
}

export function ProjectsTableRadix({ proyectos, resolutivos, municipios, giros, tiposEstudio, selectedDate, highlightExpediente }: ProjectsTableRadixProps) {
  const [activeTab, setActiveTab] = useState<"proyectos" | "resolutivos">("proyectos")
  const [search, setSearch] = useState("")
  const [municipioFilter, setMunicipioFilter] = useState<string>("all")
  const [giroFilter, setGiroFilter] = useState<string>("all")
  const [tipoFilter, setTipoFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [monthFilter, setMonthFilter] = useState<string>("all")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  // Estados para paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  
  // Estados para modal de ubicación
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [highlight, setHighlight] = useState<string | null>(null)
  
  // Hook para modal de boletín con routing
  const { isOpen: isBoletinModalOpen, selectedBoletin, openModal: openBoletinModal, closeModal: closeBoletinModal } = useBoletinModal()

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
    setSearch(highlightExpediente)
    setMunicipioFilter("all")
    setGiroFilter("all")
    setTipoFilter("all")
    setYearFilter("all")
    setMonthFilter("all")
    setHighlight(highlightExpediente)
    setPage(0)
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

  const handleBoletinSummary = async (item: any) => {
    try {
      const response = await fetch('/data/boletines.json')
      const data = await response.json()
      const boletin = data.boletines.find((b: any) => b.id === item.boletin_id)
      if (boletin) {
        openBoletinModal(boletin)
      } else {
        const boletinData = {
          id: item.boletin_id,
          fecha_publicacion: item.fecha_publicacion,
          boletin_url: item.boletin_url,
          proyectos_ingresados: [],
          resolutivos_emitidos: []
        }
        openBoletinModal(boletinData as any)
      }
    } catch (error) {
      console.error('Error cargando datos del boletín:', error)
      const boletinData = {
        id: item.boletin_id,
        fecha_publicacion: item.fecha_publicacion,
        boletin_url: item.boletin_url,
        proyectos_ingresados: [],
        resolutivos_emitidos: []
      }
      openBoletinModal(boletinData as any)
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

  const handleTabChange = (value: string) => {
    setActiveTab(value as "proyectos" | "resolutivos")
    setPage(0)
  }
  const handleChangePage = (newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (value: string) => { 
    setRowsPerPage(parseInt(value, 10))
    setPage(0)
  }

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

  const totalPages = Math.ceil((activeTab === "proyectos" ? filteredProyectos.length : filteredResolutivos.length) / rowsPerPage)
  const startIndex = page * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, activeTab === "proyectos" ? filteredProyectos.length : filteredResolutivos.length)

  if (!proyectos || !resolutivos || !Array.isArray(proyectos) || !Array.isArray(resolutivos)) {
    return (
      <Card>
        <Flex direction="column" gap="3" p="4">
          <Heading size="5" weight="bold">
            Proyectos y Resolutivos
          </Heading>
          <Text size="2" color="gray">
            No hay datos disponibles para mostrar
          </Text>
        </Flex>
      </Card>
    )
  }

  return (
    <Card>
      <Flex direction="column" gap="4" p="4">
        <Flex direction="column" gap="2">
          <Heading size="5" weight="bold">
            Tabla de proyectos ingresados y resolutivos emitidos
          </Heading>
          <Text size="2" color="gray">
            Explora los proyectos ambientales y sus resolutivos correspondientes
          </Text>
        </Flex>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Trigger value="proyectos">Proyectos ({filteredProyectos.length})</Tabs.Trigger>
            <Tabs.Trigger value="resolutivos">Resolutivos ({filteredResolutivos.length})</Tabs.Trigger>
          </Tabs.List>

          {/* Filtros */}
          <Flex direction="column" gap="3" mt="4">
            {/* Desktop */}
            <Flex 
              gap="2" 
              align="center" 
              wrap="wrap"
              display={{ initial: 'none', md: 'flex' }}
            >
              <Input
                placeholder="Buscar..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select.Root value={municipioFilter} onValueChange={setMunicipioFilter}>
                <Select.Trigger placeholder="Municipio" />
                <Select.Content>
                  <Select.Item value="all">Todos</Select.Item>
                  {municipios.map(municipio => (
                    <Select.Item key={municipio} value={municipio}>{municipio}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Select.Root value={giroFilter} onValueChange={setGiroFilter}>
                <Select.Trigger placeholder="Giro" />
                <Select.Content>
                  <Select.Item value="all">Todos</Select.Item>
                  {giros.map(giro => (
                    <Select.Item key={giro} value={giro}>{giro}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Select.Root value={tipoFilter} onValueChange={setTipoFilter}>
                <Select.Trigger placeholder="Tipo Estudio" />
                <Select.Content>
                  <Select.Item value="all">Todos</Select.Item>
                  {tiposEstudio.map(tipo => (
                    <Select.Item key={tipo} value={tipo}>{tipo}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Select.Root value={yearFilter} onValueChange={setYearFilter}>
                <Select.Trigger placeholder="Año" />
                <Select.Content>
                  <Select.Item value="all">Todos</Select.Item>
                  {getAvailableYears().map(year => (
                    <Select.Item key={year} value={year}>{year}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Select.Root value={monthFilter} onValueChange={setMonthFilter}>
                <Select.Trigger placeholder="Mes" />
                <Select.Content>
                  <Select.Item value="all">Todos</Select.Item>
                  {getAvailableMonths().map(month => (
                    <Select.Item key={month.value} value={month.value}>{month.label}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Button color="red" variant="solid" onClick={clearFilters}>Limpiar</Button>
            </Flex>

            {/* Mobile */}
            <Flex 
              gap="2" 
              align="center" 
              wrap="wrap"
              display={{ initial: 'flex', md: 'none' }}
            >
              <Input
                placeholder="Buscar..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
              />
              <Tooltip content="Filtros">
                <IconButton 
                  onClick={() => setShowMobileFilters(!showMobileFilters)} 
                  variant="outline"
                >
                  <Filter size={16} />
                </IconButton>
              </Tooltip>
              <Button color="red" variant="solid" onClick={clearFilters}>Limpiar</Button>
            </Flex>

            {showMobileFilters && (
              <Box display={{ initial: 'block', md: 'none' }}>
                <Card>
                  <Flex direction="column" gap="3" p="3">
                  <Select.Root value={municipioFilter} onValueChange={setMunicipioFilter}>
                    <Select.Trigger placeholder="Municipio" />
                    <Select.Content>
                      <Select.Item value="all">Todos</Select.Item>
                      {municipios.map(municipio => (
                        <Select.Item key={municipio} value={municipio}>{municipio}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Select.Root value={giroFilter} onValueChange={setGiroFilter}>
                    <Select.Trigger placeholder="Giro" />
                    <Select.Content>
                      <Select.Item value="all">Todos</Select.Item>
                      {giros.map(giro => (
                        <Select.Item key={giro} value={giro}>{giro}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Select.Root value={tipoFilter} onValueChange={setTipoFilter}>
                    <Select.Trigger placeholder="Tipo Estudio" />
                    <Select.Content>
                      <Select.Item value="all">Todos</Select.Item>
                      {tiposEstudio.map(tipo => (
                        <Select.Item key={tipo} value={tipo}>{tipo}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Select.Root value={yearFilter} onValueChange={setYearFilter}>
                    <Select.Trigger placeholder="Año" />
                    <Select.Content>
                      <Select.Item value="all">Todos</Select.Item>
                      {getAvailableYears().map(year => (
                        <Select.Item key={year} value={year}>{year}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Select.Root value={monthFilter} onValueChange={setMonthFilter}>
                    <Select.Trigger placeholder="Mes" />
                    <Select.Content>
                      <Select.Item value="all">Todos</Select.Item>
                      {getAvailableMonths().map(month => (
                        <Select.Item key={month.value} value={month.value}>{month.label}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  </Flex>
                </Card>
              </Box>
            )}
          </Flex>

          {/* Tabla - Proyectos */}
          <Tabs.Content value="proyectos">
            <Flex direction="column" gap="3">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Expediente</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Nombre del Proyecto</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Promovente</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Municipio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Giro</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Tipo Estudio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Fecha Ingreso</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Ubicación</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Boletín</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {paginatedProyectos.map((proyecto) => (
                    <Table.Row 
                      key={`${proyecto.expediente || 'unknown'}-${proyecto.boletin_id || 'unknown'}`} 
                      id={`row-${proyecto.expediente}`}
                      onClick={() => handleRowClick(proyecto)}
                    >
                        <Table.Cell>{proyecto.expediente || 'N/A'}</Table.Cell>
                        <Table.Cell>{proyecto.nombre_proyecto || 'N/A'}</Table.Cell>
                        <Table.Cell>{proyecto.promovente || 'N/A'}</Table.Cell>
                        <Table.Cell>{proyecto.municipio || 'N/A'}</Table.Cell>
                        <Table.Cell>{proyecto.giro || 'N/A'}</Table.Cell>
                        <Table.Cell>{proyecto.tipo_estudio || 'N/A'}</Table.Cell>
                        <Table.Cell>{proyecto.fecha_ingreso || 'N/A'}</Table.Cell>
                        <Table.Cell>
                          {proyecto.coordenadas_x && proyecto.coordenadas_y ? (
                            <Badge color="teal" variant="outline">📍 Ver ubicación</Badge>
                          ) : (
                            <Badge color="gray" variant="outline">Sin coordenadas</Badge>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <Flex gap="2" wrap="wrap">
                            {proyecto.boletin_url ? (
                              <Button 
                                size="1" 
                                onClick={(e) => { 
                                  e.stopPropagation()
                                  window.open(proyecto.boletin_url, '_blank', 'noopener,noreferrer')
                                }}
                              >
                                Consultar boletín
                              </Button>
                            ) : (
                              <Badge color="gray" variant="outline">Sin URL</Badge>
                            )}
                            <Button 
                              size="1" 
                              variant="outline" 
                              onClick={(e) => { 
                                e.stopPropagation()
                                handleBoletinSummary(proyecto)
                              }}
                            >
                              📋 Resumen
                            </Button>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table.Root>

              {/* Paginación Proyectos */}
              <Flex align="center" justify="between" gap="3" wrap="wrap">
                <Flex align="center" gap="2">
                  <Text size="2" color="gray">Filas por página:</Text>
                  <Select.Root value={rowsPerPage.toString()} onValueChange={handleChangeRowsPerPage}>
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="10">10</Select.Item>
                      <Select.Item value="25">25</Select.Item>
                      <Select.Item value="50">50</Select.Item>
                      <Select.Item value="100">100</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                <Text size="2" color="gray">
                  {startIndex + 1}-{endIndex} de {filteredProyectos.length}
                </Text>
                <Flex gap="2">
                  <Button 
                    size="1" 
                    variant="outline" 
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 0}
                  >
                    Anterior
                  </Button>
                  <Button 
                    size="1" 
                    variant="outline" 
                    onClick={() => handleChangePage(page + 1)}
                    disabled={page >= totalPages - 1}
                  >
                    Siguiente
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Tabs.Content>

          {/* Tabla - Resolutivos */}
          <Tabs.Content value="resolutivos">
            <Flex direction="column" gap="3">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>No. Oficio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Expediente</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Nombre del Proyecto</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Promovente</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Fecha Ingreso</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Fecha Resolutivo</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Municipio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Ubicación</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Boletín Ingreso</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Boletín</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {paginatedResolutivos.map((resolutivo) => (
                    <Table.Row 
                      key={`${resolutivo.no_oficio_resolutivo || 'unknown'}-${resolutivo.boletin_id || 'unknown'}`} 
                      onClick={() => handleRowClick(resolutivo)}
                    >
                        <Table.Cell>{resolutivo.no_oficio_resolutivo || 'N/A'}</Table.Cell>
                        <Table.Cell>{resolutivo.expediente || 'N/A'}</Table.Cell>
                        <Table.Cell>{resolutivo.nombre_proyecto || 'N/A'}</Table.Cell>
                        <Table.Cell>{resolutivo.promovente || 'N/A'}</Table.Cell>
                        <Table.Cell>{resolutivo.fecha_ingreso || 'N/A'}</Table.Cell>
                        <Table.Cell>{resolutivo.fecha_resolutivo || 'N/A'}</Table.Cell>
                        <Table.Cell>{resolutivo.municipio || 'N/A'}</Table.Cell>
                        <Table.Cell>
                          {resolutivo.coordenadas_x && resolutivo.coordenadas_y ? (
                            <Badge color="teal" variant="outline">📍 Ver ubicación</Badge>
                          ) : (
                            <Badge color="gray" variant="outline">Sin coordenadas</Badge>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {resolutivo.boletin_ingreso_url ? (
                            <Button 
                              size="1" 
                              variant="outline" 
                              color="green"
                              onClick={(e) => { 
                                e.stopPropagation()
                                window.open(resolutivo.boletin_ingreso_url, '_blank', 'noopener,noreferrer')
                              }}
                            >
                              📄 Ingreso
                            </Button>
                          ) : (
                            <Badge color="gray" variant="outline">Sin URL</Badge>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <Flex gap="2" wrap="wrap">
                            {resolutivo.boletin_url ? (
                              <Button 
                                size="1" 
                                onClick={(e) => { 
                                  e.stopPropagation()
                                  window.open(resolutivo.boletin_url, '_blank', 'noopener,noreferrer')
                                }}
                              >
                                Consultar boletín
                              </Button>
                            ) : (
                              <Badge color="gray" variant="outline">Sin URL</Badge>
                            )}
                            <Button 
                              size="1" 
                              variant="outline" 
                              onClick={(e) => { 
                                e.stopPropagation()
                                handleBoletinSummary(resolutivo)
                              }}
                            >
                              📋 Resumen
                            </Button>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table.Root>

              {/* Paginación Resolutivos */}
              <Flex align="center" justify="between" gap="3" wrap="wrap">
                <Flex align="center" gap="2">
                  <Text size="2" color="gray">Filas por página:</Text>
                  <Select.Root value={rowsPerPage.toString()} onValueChange={handleChangeRowsPerPage}>
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="10">10</Select.Item>
                      <Select.Item value="25">25</Select.Item>
                      <Select.Item value="50">50</Select.Item>
                      <Select.Item value="100">100</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                <Text size="2" color="gray">
                  {startIndex + 1}-{endIndex} de {filteredResolutivos.length}
                </Text>
                <Flex gap="2">
                  <Button 
                    size="1" 
                    variant="outline" 
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 0}
                  >
                    Anterior
                  </Button>
                  <Button 
                    size="1" 
                    variant="outline" 
                    onClick={() => handleChangePage(page + 1)}
                    disabled={page >= totalPages - 1}
                  >
                    Siguiente
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Tabs.Content>
        </Tabs.Root>
      </Flex>
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
    </Card>
  )
}

