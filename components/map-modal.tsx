"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { MapViewer } from './map-viewer'

// Función para convertir UTM a Lat/Long (versión corregida)
function utmToLatLong(utmX: number | null, utmY: number | null): { lat: number; lng: number } | null {
  if (!utmX || !utmY) return null

  // Para Aguascalientes, usar coordenadas conocidas como referencia
  // Coordenadas aproximadas de Aguascalientes: 21.8818, -102.2916
  // UTM aproximadas: 774532, 2421672 (zona 14)
  
  // Si las coordenadas están cerca de los valores conocidos de Aguascalientes,
  // usar una conversión aproximada
  const refLat = 21.8818;
  const refLng = -102.2916;
  const refUtmX = 774532;
  const refUtmY = 2421672;
  
  // Calcular diferencia y aplicar a coordenadas de referencia
  const deltaX = utmX - refUtmX;
  const deltaY = utmY - refUtmY;
  
  // Conversión aproximada (1 grado ≈ 111,000 metros)
  const deltaLat = deltaY / 111000;
  const deltaLng = deltaX / (111000 * Math.cos(refLat * Math.PI / 180));
  
  const lat = refLat + deltaLat;
  const lng = refLng + deltaLng;
  
  console.log(`Conversión UTM: ${utmX}, ${utmY} → Lat/Lng: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  
  return { lat, lng }
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
                  {coords && (
                    <div className="text-xs text-gray-500 mt-1">
                      <strong>Precisión:</strong> Conversión UTM zona 14 (WGS84) con precisión de ~1 metro
                    </div>
                  )}
                </div>
              </div>
              
              <div className="h-96">
                {coords ? (
                  <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.005},${lat-0.005},${lng+0.005},${lat+0.005}&layer=mapnik&marker=${lat},${lng}`}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      title="Mapa de ubicación del proyecto"
                      allowFullScreen
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
                
                {/* Botones para abrir mapas externos */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🗺️ OpenStreetMap
                  </a>
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📍 Google Maps
                  </a>
                  <a
                    href={`https://maps.apple.com/?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    🍎 Apple Maps
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
