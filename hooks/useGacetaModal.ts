'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { ProcessedGacetaAnalysis } from './useGacetasData'
import type { RegistroGaceta } from './useGacetasData'

// Cache del JSON para evitar múltiples fetches
let gacetasDataCache: any = null
let gacetasDataPromise: Promise<any> | null = null

async function fetchGacetasData(): Promise<any> {
  // Si ya tenemos los datos en cache, retornarlos inmediatamente
  if (gacetasDataCache) {
    return gacetasDataCache
  }
  
  // Si hay una petición en curso, esperarla
  if (gacetasDataPromise) {
    return gacetasDataPromise
  }
  
  // Crear nueva petición y cachearla
  gacetasDataPromise = fetch('/data/gacetas_semarnat_analizadas.json')
    .then(response => response.json())
    .then(data => {
      gacetasDataCache = data
      return data
    })
    .finally(() => {
      gacetasDataPromise = null
    })
  
  return gacetasDataPromise
}

// Función helper para normalizar fecha
function normalizeFecha(gaceta: any): string {
  if (gaceta.fecha_publicacion) {
    return gaceta.fecha_publicacion
  } else if (gaceta.analisis_completo?.gaceta?.fecha_publicacion) {
    return gaceta.analisis_completo.gaceta.fecha_publicacion
  } else {
    return `${gaceta.año}-01-01`
  }
}

export function useGacetaModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGaceta, setSelectedGaceta] = useState<ProcessedGacetaAnalysis | null>(null)
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroGaceta | null>(null)

  // Detectar si hay un parámetro de gaceta en la URL al cargar la página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const gacetaId = urlParams.get('gaceta')
      const registroId = urlParams.get('registro')
      if (gacetaId) {
        // Cargar los datos de la gaceta desde el JSON
        if (registroId) {
          loadGacetaDataWithRegistro(gacetaId, parseInt(registroId))
        } else {
          loadGacetaData(gacetaId)
        }
      }
    }
  }, [])

  const loadGacetaDataWithRegistro = useCallback(async (gacetaId: string, registroId: number) => {
    try {
      const data = await fetchGacetasData()
      const gaceta = data.analyses.find((g: any) => g.gaceta_id === gacetaId)
      
      if (gaceta) {
        // Buscar el registro en la gaceta
        let registroEncontrado: RegistroGaceta | null = null
        if (gaceta.analisis_completo?.registros) {
          registroEncontrado = gaceta.analisis_completo.registros.find((r: RegistroGaceta) => r.id_db === registroId) || null
        }
        
        setSelectedGaceta({
          ...gaceta,
          fecha_publicacion: normalizeFecha(gaceta)
        } as ProcessedGacetaAnalysis)
        setSelectedRegistro(registroEncontrado)
        setIsOpen(true)
      }
    } catch (error) {
      console.error('Error cargando datos de la gaceta:', error)
    }
  }, [])

  const loadGacetaData = useCallback(async (gacetaId: string) => {
    try {
      const data = await fetchGacetasData()
      const gaceta = data.analyses.find((g: any) => g.gaceta_id === gacetaId)
      
      if (gaceta) {
        setSelectedGaceta({
          ...gaceta,
          fecha_publicacion: normalizeFecha(gaceta)
        } as ProcessedGacetaAnalysis)
        setIsOpen(true)
      } else {
        console.warn(`Gaceta con ID ${gacetaId} no encontrada`)
      }
    } catch (error) {
      console.error('Error cargando datos de la gaceta:', error)
    }
  }, [])

  const openModal = useCallback((gaceta: ProcessedGacetaAnalysis, registro?: RegistroGaceta | null) => {
    setSelectedGaceta(gaceta)
    setSelectedRegistro(registro || null)
    setIsOpen(true)
    // Actualizar la URL para incluir el parámetro de la gaceta
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('gaceta', gaceta.gaceta_id)
      if (registro?.id_db) {
        url.searchParams.set('registro', registro.id_db.toString())
      }
      window.history.pushState({}, '', url.toString())
    }
  }, [])

  const openModalByUrl = useCallback((gacetaUrl: string, registro?: RegistroGaceta | null) => {
    // Buscar la gaceta por URL en los datos cargados
    loadGacetaByUrl(gacetaUrl, registro)
  }, [])

  const openModalWithRegistro = useCallback(async (gacetaUrl: string, registroId: number) => {
    try {
      const data = await fetchGacetasData()
      const gaceta = data.analyses.find((g: any) => g.url === gacetaUrl)
      
      if (!gaceta) return
      
      // Buscar el registro en la gaceta
      let registroEncontrado: RegistroGaceta | null = null
      if (gaceta.analisis_completo?.registros) {
        registroEncontrado = gaceta.analisis_completo.registros.find((r: RegistroGaceta) => r.id_db === registroId) || null
      }
      
      setSelectedGaceta({
        ...gaceta,
        fecha_publicacion: normalizeFecha(gaceta)
      } as ProcessedGacetaAnalysis)
      setSelectedRegistro(registroEncontrado)
      setIsOpen(true)
      
      // Actualizar URL
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.set('gaceta', gaceta.gaceta_id)
        if (registroEncontrado?.id_db) {
          url.searchParams.set('registro', registroEncontrado.id_db.toString())
        }
        window.history.pushState({}, '', url.toString())
      }
    } catch (error) {
      console.error('Error cargando datos de la gaceta con registro:', error)
    }
  }, [])

  const loadGacetaByUrl = useCallback(async (gacetaUrl: string, registro?: RegistroGaceta | null) => {
    try {
      const data = await fetchGacetasData()
      const gaceta = data.analyses.find((g: any) => g.url === gacetaUrl)
      
      if (gaceta) {
        setSelectedGaceta({
          ...gaceta,
          fecha_publicacion: normalizeFecha(gaceta)
        } as ProcessedGacetaAnalysis)
        setSelectedRegistro(registro || null)
        setIsOpen(true)
        
        // Actualizar URL
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.set('gaceta', gaceta.gaceta_id)
          if (registro?.id_db) {
            url.searchParams.set('registro', registro.id_db.toString())
          }
          window.history.pushState({}, '', url.toString())
        }
      }
    } catch (error) {
      console.error('Error cargando datos de la gaceta por URL:', error)
    }
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setSelectedGaceta(null)
    setSelectedRegistro(null)
    // Remover el parámetro de gaceta de la URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('gaceta')
      url.searchParams.delete('registro')
      window.history.pushState({}, '', url.toString())
    }
  }, [])

  return {
    isOpen,
    selectedGaceta,
    selectedRegistro,
    openModal,
    openModalByUrl,
    openModalWithRegistro,
    closeModal
  }
}

