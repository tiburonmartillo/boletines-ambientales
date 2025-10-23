'use client'

import { useState, useEffect } from 'react'
import { Boletin } from '@/lib/types'

export function useBoletinModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBoletin, setSelectedBoletin] = useState<Boletin | null>(null)

  // Detectar si hay un parámetro de boletín en la URL al cargar la página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const boletinId = urlParams.get('boletin')
      if (boletinId && !isNaN(Number(boletinId))) {
        // Cargar los datos del boletín desde el JSON
        loadBoletinData(Number(boletinId))
      }
    }
  }, [])

  const loadBoletinData = async (boletinId: number) => {
    try {
      // Cargar datos desde el archivo JSON público
      const response = await fetch('/data/boletines.json')
      const data = await response.json()
      const boletin = data.boletines.find((b: Boletin) => b.id === boletinId)
      
      if (boletin) {
        setSelectedBoletin(boletin)
        setIsOpen(true)
      } else {
        console.warn(`Boletín con ID ${boletinId} no encontrado`)
      }
    } catch (error) {
      console.error('Error cargando datos del boletín:', error)
    }
  }

  const openModal = (boletin: Boletin) => {
    setSelectedBoletin(boletin)
    setIsOpen(true)
    // Actualizar la URL para incluir el parámetro del boletín
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('boletin', boletin.id.toString())
      window.history.pushState({}, '', url.toString())
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedBoletin(null)
    // Remover el parámetro de boletín de la URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('boletin')
      window.history.pushState({}, '', url.toString())
    }
  }

  return {
    isOpen,
    selectedBoletin,
    openModal,
    closeModal
  }
}
