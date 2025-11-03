"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Box, Card, CardContent, TextField, Typography } from "@mui/material"

type Proyecto = {
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
  naturaleza_proyecto: string
  fecha_publicacion: string
  boletin_url: string
}

interface ProjectsMapProps {
  proyectos: Proyecto[]
}

// Carga Leaflet desde CDN sólo en el cliente
const useLeaflet = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const cssId = "leaflet-css"
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link")
      link.id = cssId
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""
      document.head.appendChild(link)
    }

    const scriptId = "leaflet-js"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      script.crossOrigin = ""
      script.onload = () => setReady(true)
      document.body.appendChild(script)
    } else {
      setReady(true)
    }
  }, [])

  return ready
}

// Conversión rápida UTM zona 13/14 → Lat/Lng usando heurística (coincide con MapModal)
function convertCoords(x: number | null, y: number | null): { lat: number; lng: number } | null {
  if (!x || !y) return null
  // Heurística: si |x| y |y| parecen lat/lng ya en grados
  if (Math.abs(x) <= 180 && Math.abs(y) <= 90) {
    return { lat: y, lng: x }
  }
  // Trata como UTM zona 14 por defecto
  const zone = 14
  const sm_a = 6378137
  const sm_b = 6356752.314
  const UTMScaleFactor = 0.9996
  let xx = x - 500000
  xx = xx / UTMScaleFactor
  const yy = y / UTMScaleFactor
  const lambda0 = ((-183 + (zone * 6)) / 180) * Math.PI
  const n = (sm_a - sm_b) / (sm_a + sm_b)
  const alpha_ = ((sm_a + sm_b) / 2) * (1 + (n ** 2) / 4) + (n ** 4) / 64
  const y_ = yy / alpha_
  const beta_ = (3 * n / 2) + (-27 * (n ** 3) / 32) + (269 * (n ** 5) / 512)
  const gamma_ = (21 * (n ** 2) / 16) + (-55 * (n ** 4) / 32)
  const delta_ = (151 * (n ** 3) / 96) + (-417 * (n ** 5) / 128)
  const epsilon_ = (1097 * (n ** 4) / 512)
  const phif = y_ + (beta_ * Math.sin(2 * y_)) + (gamma_ * Math.sin(4 * y_)) + (delta_ * Math.sin(6 * y_)) + (epsilon_ * Math.sin(8 * y_))
  const ep2 = (sm_a ** 2 - sm_b ** 2) / (sm_b ** 2)
  const cf = Math.cos(phif)
  const nuf2 = ep2 * (cf ** 2)
  const Nf = (sm_a ** 2) / (sm_b * Math.sqrt(1 + nuf2))
  const tf = Math.tan(phif)
  let Nfpow = Nf
  const x1frac = 1 / (Nfpow * cf)
  Nfpow *= Nf
  const x2frac = tf / (2 * Nfpow)
  Nfpow *= Nf
  const x3frac = 1 / (6 * Nfpow * cf)
  Nfpow *= Nf
  const x4frac = tf / (24 * Nfpow)
  const x2poly = -1 - nuf2
  const x3poly = -1 - 2 * tf * tf - nuf2
  const x4poly = 5 + 3 * tf * tf + 6 * nuf2 - 6 * tf * tf * nuf2 - 3 * (nuf2 * nuf2) - 9 * tf * tf * (nuf2 * nuf2)
  const lat = phif + x2frac * x2poly * (xx * xx) + x4frac * x4poly * xx ** 4
  const lng = lambda0 + x1frac * xx + x3frac * x3poly * xx ** 3
  return { lat: (lat / Math.PI) * 180, lng: (lng / Math.PI) * 180 }
}

export function ProjectsMap({ proyectos }: ProjectsMapProps) {
  const ready = useLeaflet()
  const mapRef = useRef<HTMLDivElement | null>(null)
  const leafletMapRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const [query, setQuery] = useState("")

  const items = useMemo(() => {
    const q = query.toLowerCase()
    return (proyectos || []).filter(p => {
      const promovente = (p.promovente || "").toLowerCase()
      const expediente = (p.expediente || "").toLowerCase()
      const nombre = (p.nombre_proyecto || "").toLowerCase()
      return promovente.includes(q) || expediente.includes(q) || nombre.includes(q)
    })
  }, [proyectos, query])

  useEffect(() => {
    if (!ready || !mapRef.current || typeof window === "undefined") return
    const L = (window as any).L
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([21.8818, -102.2916], 8)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMapRef.current)
      markersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current)
    }
  }, [ready])

  useEffect(() => {
    if (!ready || !markersLayerRef.current) return
    const L = (window as any).L
    markersLayerRef.current.clearLayers()
    const bounds: any[] = []
    items.forEach(p => {
      const coords = convertCoords(p.coordenadas_x, p.coordenadas_y)
      if (!coords) return
      const html = `
        <div style="min-width:240px">
          <div style="font-weight:600;margin-bottom:4px">${(p.nombre_proyecto||'Sin nombre')}</div>
          <div style="font-size:12px;opacity:.8">Expediente: ${p.expediente||'N/A'}</div>
          <div style="font-size:12px;opacity:.8">Promovente: ${p.promovente||'N/A'}</div>
        </div>`
      const marker = L.marker([coords.lat, coords.lng]).bindTooltip(html, { direction: 'top' })
      marker.addTo(markersLayerRef.current)
      bounds.push([coords.lat, coords.lng])
    })
    if (bounds.length > 0) {
      (leafletMapRef.current as any).fitBounds(bounds, { padding: [30, 30] })
    }
  }, [items, ready])

  return (
    <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid rgba(30,58,138,.1)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="semibold">Mapa de proyectos ingresados</Typography>
            <Typography variant="body2" color="text.secondary">Pasa el cursor sobre un marcador para ver detalles. Usa la búsqueda para filtrar por promovente, expediente o nombre del proyecto.</Typography>
          </Box>
          <TextField 
            label="Buscar en el mapa" 
            size="small" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="promovente, expediente, nombre..."
          />
          <Box sx={{ height: 520, borderRadius: 2, overflow: 'hidden' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}


