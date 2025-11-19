import { NextRequest, NextResponse } from 'next/server'
import { enviarSuscripcion, validarDatosSuscripcion, type SubscriptionData } from '@/lib/subscription-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const subscriptionData: Partial<SubscriptionData> = {
      email: body.email,
      intereses: body.intereses || ['todos'],
      municipio: body.municipio || null,
      fechaSuscripcion: new Date().toISOString(),
      fuente: body.fuente || 'boletines-ssmaa-v2'
    }

    // Validar datos
    const validacion = validarDatosSuscripcion(subscriptionData)
    if (!validacion.valido) {
      return NextResponse.json(
        {
          success: false,
          errors: validacion.errores
        },
        { status: 400 }
      )
    }

    // Enviar a Make.com
    const resultado = await enviarSuscripcion(subscriptionData as SubscriptionData)

    if (!resultado.success) {
      // Manejar error de email duplicado
      if (resultado.error === 'EMAIL_DUPLICADO' || resultado.message?.includes('duplicado')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Este correo ya está suscrito',
            error: 'EMAIL_DUPLICADO'
          },
          { status: 409 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          message: resultado.error || 'Error al procesar la suscripción'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Suscripción exitosa'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en API de suscripción:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

