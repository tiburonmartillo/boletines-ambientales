'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Boletin } from '@/lib/types'

export function useBoletinModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBoletin, setSelectedBoletin] = useState<Boletin | null>(null)

  // Detectar si hay un parámetro de boletín en la URL
  useEffect(() => {
    const boletinId = searchParams.get('boletin')
    if (boletinId && !isNaN(Number(boletinId))) {
      // Cargar los datos del boletín desde el JSON
      loadBoletinData(Number(boletinId))
    }
  }, [searchParams])

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
    const params = new URLSearchParams(searchParams.toString())
    params.set('boletin', boletin.id.toString())
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedBoletin(null)
    // Remover el parámetro de boletín de la URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete('boletin')
    const newSearch = params.toString()
    const newUrl = newSearch ? `?${newSearch}` : window.location.pathname
    router.push(newUrl, { scroll: false })
  }

  return {
    isOpen,
    selectedBoletin,
    openModal,
    closeModal
  }
}
