import { useState, useEffect } from 'react'
import { Boletin } from '@/lib/types'
import { calcularFechaLimiteConsulta, validarBoletin } from '@/lib/boletin-utils'

interface UseBoletinSummaryResult {
  boletin: Boletin | null
  loading: boolean
  error: string | null
  fechaLimite: string | null
  fechaLimiteFormateada: string | null
  isValid: boolean
}

export function useBoletinSummary(boletinId: number): UseBoletinSummaryResult {
  const [boletin, setBoletin] = useState<Boletin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fechaLimite, setFechaLimite] = useState<string | null>(null)
  const [fechaLimiteFormateada, setFechaLimiteFormateada] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const loadBoletin = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar datos del JSON
        const response = await fetch('/data/boletines.json')
        if (!response.ok) {
          throw new Error('Error al cargar los datos de boletines')
        }

        const data = await response.json()
        const boletinEncontrado = data.boletines.find((b: Boletin) => b.id === boletinId)

        if (!boletinEncontrado) {
          throw new Error(`Boletín con ID ${boletinId} no encontrado`)
        }

        // Validar boletín
        if (!validarBoletin(boletinEncontrado)) {
          throw new Error('El boletín no tiene datos válidos para mostrar')
        }

        setBoletin(boletinEncontrado)
        setIsValid(true)

        // Calcular fecha límite
        const fechaLimiteCalculada = calcularFechaLimiteConsulta(boletinEncontrado.fecha_publicacion)
        setFechaLimite(fechaLimiteCalculada)
        
        // Formatear fecha límite
        const fechaLimiteFormateadaCalculada = new Date(fechaLimiteCalculada).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        setFechaLimiteFormateada(fechaLimiteFormateadaCalculada)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setIsValid(false)
      } finally {
        setLoading(false)
      }
    }

    if (boletinId) {
      loadBoletin()
    }
  }, [boletinId])

  return {
    boletin,
    loading,
    error,
    fechaLimite,
    fechaLimiteFormateada,
    isValid
  }
}

/**
 * Hook para obtener todos los boletines disponibles (para navegación)
 */
export function useBoletinesList() {
  const [boletines, setBoletines] = useState<Boletin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBoletines = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/data/boletines.json')
        if (!response.ok) {
          throw new Error('Error al cargar los datos de boletines')
        }

        const data = await response.json()
        setBoletines(data.boletines || [])

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    loadBoletines()
  }, [])

  return {
    boletines,
    loading,
    error
  }
}

/**
 * Hook para obtener el boletín más reciente
 */
export function useLatestBoletin() {
  const { boletines, loading, error } = useBoletinesList()
  const [latestBoletin, setLatestBoletin] = useState<Boletin | null>(null)

  useEffect(() => {
    if (boletines.length > 0) {
      // Ordenar por fecha de publicación descendente y tomar el primero
      const sortedBoletines = [...boletines].sort((a, b) => 
        new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime()
      )
      setLatestBoletin(sortedBoletines[0])
    }
  }, [boletines])

  return {
    latestBoletin,
    loading,
    error
  }
}
