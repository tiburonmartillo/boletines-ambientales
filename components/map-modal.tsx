"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { MapViewer } from './map-viewer'

// Función para convertir UTM a Lat/Long (copiada del MapViewer)
function utmToLatLong(utmX: number | null, utmY: number | null): { lat: number; lng: number } | null {
  if (!utmX || !utmY) return null

  let x = utmX
  let y = utmY
  
  if (y > x && y > 1000000) {
    const temp = x
    x = y
    y = temp
  }

  const zone = 14
  const falseEasting = 500000
  const falseNorthing = 0
  const k0 = 0.9996
  const a = 6378137
  const e2 = 0.00669438002290
  
  const x_adj = x - falseEasting
  const y_adj = y - falseNorthing
  
  const m = y_adj / k0
  const mu = m / (a * (1 - e2/4 - 3*e2*e2/64 - 5*e2*e2*e2/256))
  
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2))
  const j1 = 3*e1/2 - 27*e1*e1*e1/32
  const j2 = 21*e1*e1/16 - 55*e1*e1*e1*e1/32
  const j3 = 151*e1*e1*e1/96
  const j4 = 1097*e1*e1*e1*e1/512
  
  const fp = mu + j1*Math.sin(2*mu) + j2*Math.sin(4*mu) + j3*Math.sin(6*mu) + j4*Math.sin(8*mu)
  
  const e_prim2 = e2/(1-e2)
  const c1 = e_prim2 * Math.cos(fp) * Math.cos(fp)
  const t1 = Math.tan(fp) * Math.tan(fp)
  const n1 = a / Math.sqrt(1 - e2*Math.sin(fp)*Math.sin(fp))
  const r1 = a*(1-e2)/Math.pow(1 - e2*Math.sin(fp)*Math.sin(fp), 1.5)
  const d = x_adj / (n1*k0)
  
  const lat = fp - (n1*Math.tan(fp)/r1) * (d*d/2 - (5 + 3*t1 + 10*c1 - 4*c1*c1 - 9*e_prim2)*d*d*d*d/24 + (61 + 90*t1 + 298*c1 + 45*t1*t1 - 252*e_prim2 - 3*c1*c1)*d*d*d*d*d*d/720)
  const lon = (d - (1 + 2*t1 + c1)*d*d*d/6 + (5 - 2*c1 + 28*t1 - 3*c1*c1 + 8*e_prim2 + 24*t1*t1)*d*d*d*d*d/120) / Math.cos(fp)
  
  const longitude = lon * 180 / Math.PI + (zone - 1) * 6 - 180
  const latitude = lat * 180 / Math.PI
  
  return { lat: latitude, lng: longitude }
}

interface MapModalProps {
  coordenadas_x: number | null
  coordenadas_y: number | null
  expediente: string
  nombre_proyecto: string
  municipio: string
}

export function MapModal({ coordenadas_x, coordenadas_y, expediente, nombre_proyecto, municipio }: MapModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!coordenadas_x || !coordenadas_y) {
    return (
      <span className="text-gray-400 text-sm">Sin coordenadas</span>
    )
  }

  // Convertir coordenadas UTM a Lat/Lng
  const coords = utmToLatLong(coordenadas_x, coordenadas_y)
  const lat = coords?.lat || 21.8818 // Coordenadas por defecto de Aguascalientes
  const lng = coords?.lng || -102.2916

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200"
        title="Ver ubicación en mapa"
      >
        📍Ver ubicación
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Ubicación del Proyecto</h2>
                <p className="text-sm text-gray-600 mt-1">{expediente} - {municipio}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Map Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">{nombre_proyecto}</h3>
                <div className="text-sm text-gray-600 mt-2">
                  <div><strong>Expediente:</strong> {expediente}</div>
                  <div><strong>Municipio:</strong> {municipio}</div>
                  <div><strong>Coordenadas UTM:</strong> {coordenadas_x}, {coordenadas_y}</div>
                  {coords && (
                    <div><strong>Coordenadas Lat/Lng:</strong> {lat.toFixed(6)}, {lng.toFixed(6)}</div>
                  )}
                </div>
              </div>
              
              <div className="h-96">
                {coords ? (
                  <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      title="Mapa de ubicación del proyecto"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-600 mb-4">📍 Mapa de ubicación</div>
                      <div className="text-sm text-gray-500 mb-4">
                        UTM: {coordenadas_x}, {coordenadas_y}
                      </div>
                      <div className="text-sm text-red-500 mb-4">
                        Error: No se pudieron convertir las coordenadas UTM
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Botón para abrir en OpenStreetMap */}
                <div className="mt-4 text-center">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🗺️ Abrir en OpenStreetMap
                  </a>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
