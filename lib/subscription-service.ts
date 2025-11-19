export interface SubscriptionData {
  email: string
  intereses?: string[]
  municipio?: string
  fechaSuscripcion: string
  fuente: string
}

export interface SubscriptionResponse {
  success: boolean
  message?: string
  error?: string
}

/**
 * Envía datos de suscripción a Make.com webhook
 */
export async function enviarSuscripcion(
  data: SubscriptionData
): Promise<SubscriptionResponse> {
  const webhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL || process.env.MAKE_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('MAKE_WEBHOOK_URL no está configurada')
    return {
      success: false,
      error: 'Configuración del servidor incompleta'
    }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        intereses: data.intereses || ['todos'],
        municipio: data.municipio || null,
        fechaSuscripcion: data.fechaSuscripcion,
        fuente: data.fuente || 'boletines-ssmaa-v2',
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error en webhook de Make.com:', errorText)
      
      // Verificar si es un error de email duplicado (depende de cómo Make.com lo maneje)
      if (response.status === 409 || errorText.toLowerCase().includes('duplicate')) {
        return {
          success: false,
          message: 'Este correo ya está suscrito',
          error: 'EMAIL_DUPLICADO'
        }
      }

      return {
        success: false,
        error: `Error del servidor: ${response.status}`
      }
    }

    return {
      success: true,
      message: 'Suscripción exitosa'
    }
  } catch (error) {
    console.error('Error al enviar suscripción:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Valida los datos de suscripción antes de enviar
 */
export function validarDatosSuscripcion(data: Partial<SubscriptionData>): {
  valido: boolean
  errores: string[]
} {
  const errores: string[] = []

  if (!data.email || !data.email.trim()) {
    errores.push('El correo electrónico es requerido')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errores.push('El formato del correo electrónico no es válido')
  }

  return {
    valido: errores.length === 0,
    errores
  }
}

