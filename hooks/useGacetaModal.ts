'use client'

import { useState, useEffect } from 'react'
import type { ProcessedGacetaAnalysis } from './useGacetasData'
import type { RegistroGaceta } from './useGacetasData'

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

  const loadGacetaDataWithRegistro = async (gacetaId: string, registroId: number) => {
    try {
      const response = await fetch('/data/gacetas_semarnat_analizadas.json')
      const data = await response.json()
      const gaceta = data.analyses.find((g: any) => g.gaceta_id === gacetaId)
      
      if (gaceta) {
        // Buscar el registro en la gaceta
        let registroEncontrado: RegistroGaceta | null = null
        if (gaceta.analisis_completo?.registros) {
          registroEncontrado = gaceta.analisis_completo.registros.find((r: RegistroGaceta) => r.id_db === registroId) || null
        }
        
        // Normalizar fecha_publicacion
        let fechaNormalizada: string
        if (gaceta.fecha_publicacion) {
          fechaNormalizada = gaceta.fecha_publicacion
        } else if (gaceta.analisis_completo?.gaceta?.fecha_publicacion) {
          fechaNormalizada = gaceta.analisis_completo.gaceta.fecha_publicacion
        } else {
          fechaNormalizada = `${gaceta.año}-01-01`
        }
        
        setSelectedGaceta({
          ...gaceta,
          fecha_publicacion: fechaNormalizada
        } as ProcessedGacetaAnalysis)
        setSelectedRegistro(registroEncontrado)
        setIsOpen(true)
      }
    } catch (error) {
      console.error('Error cargando datos de la gaceta:', error)
    }
  }

  const loadGacetaData = async (gacetaId: string) => {
    try {
      // Cargar datos desde el archivo JSON público
      const response = await fetch('/data/gacetas_semarnat_analizadas.json')
      const data = await response.json()
      const gaceta = data.analyses.find((g: any) => g.gaceta_id === gacetaId)
      
      if (gaceta) {
        // Normalizar fecha_publicacion
        let fechaNormalizada: string
        if (gaceta.fecha_publicacion) {
          fechaNormalizada = gaceta.fecha_publicacion
        } else if (gaceta.analisis_completo?.gaceta?.fecha_publicacion) {
          fechaNormalizada = gaceta.analisis_completo.gaceta.fecha_publicacion
        } else {
          fechaNormalizada = `${gaceta.año}-01-01`
        }
        
        setSelectedGaceta({
          ...gaceta,
          fecha_publicacion: fechaNormalizada
        } as ProcessedGacetaAnalysis)
        setIsOpen(true)
      } else {
        console.warn(`Gaceta con ID ${gacetaId} no encontrada`)
      }
    } catch (error) {
      console.error('Error cargando datos de la gaceta:', error)
    }
  }

  const openModal = (gaceta: ProcessedGacetaAnalysis, registro?: RegistroGaceta | null) => {
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
  }

  const openModalByUrl = (gacetaUrl: string, registro?: RegistroGaceta | null) => {
    // Buscar la gaceta por URL en los datos cargados
    loadGacetaByUrl(gacetaUrl, registro)
  }

  const openModalWithRegistro = async (gacetaUrl: string, registroId: number) => {
    try {
      // Cargar la gaceta
      const response = await fetch('/data/gacetas_semarnat_analizadas.json')
      const data = await response.json()
      const gaceta = data.analyses.find((g: any) => g.url === gacetaUrl)
      
      if (!gaceta) return
      
      // Buscar el registro en la gaceta
      let registroEncontrado: RegistroGaceta | null = null
      if (gaceta.analisis_completo?.registros) {
        registroEncontrado = gaceta.analisis_completo.registros.find((r: RegistroGaceta) => r.id_db === registroId) || null
      }
      
      // Normalizar fecha
      let fechaNormalizada: string
      if (gaceta.fecha_publicacion) {
        fechaNormalizada = gaceta.fecha_publicacion
      } else if (gaceta.analisis_completo?.gaceta?.fecha_publicacion) {
        fechaNormalizada = gaceta.analisis_completo.gaceta.fecha_publicacion
      } else {
        fechaNormalizada = `${gaceta.año}-01-01`
      }
      
      setSelectedGaceta({
        ...gaceta,
        fecha_publicacion: fechaNormalizada
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
  }

  const loadGacetaByUrl = async (gacetaUrl: string, registro?: RegistroGaceta | null) => {
    try {
      const response = await fetch('/data/gacetas_semarnat_analizadas.json')
      const data = await response.json()
      const gaceta = data.analyses.find((g: any) => g.url === gacetaUrl)
      
      if (gaceta) {
        // Normalizar fecha_publicacion
        let fechaNormalizada: string
        if (gaceta.fecha_publicacion) {
          fechaNormalizada = gaceta.fecha_publicacion
        } else if (gaceta.analisis_completo?.gaceta?.fecha_publicacion) {
          fechaNormalizada = gaceta.analisis_completo.gaceta.fecha_publicacion
        } else {
          fechaNormalizada = `${gaceta.año}-01-01`
        }
        
        setSelectedGaceta({
          ...gaceta,
          fecha_publicacion: fechaNormalizada
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
  }

  const closeModal = () => {
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
  }

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

