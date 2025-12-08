import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { numBitacora } = body

    if (!numBitacora) {
      return NextResponse.json(
        { error: 'Número de bitácora es requerido' },
        { status: 400 }
      )
    }

    // Hacer la petición al API de SEMARNAT para obtener el historial
    const response = await fetch(
      'https://apps1.semarnat.gob.mx/ws-bitacora-tramite/historial/search-historial-bitacora',
      {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJzZW1hcm5hdEpXVCIsInN1YiI6IlVzdWFyaW97c2VnVXN1YXJpb3NJZDoxLHNlZ1VzdWFyaW9zTm9tYnJlVXN1YXJpbzogJ2FuYV9vbHZlcmFfc2FyZ2F6bycsc2VnVXN1YXJpb3NQYXNzd29yZDogJyQyYSQxMCRqb21vU2JCT0VycWhoWmU3cEFER2J1WjA4ZDhhUUpucEk0dkhOZU9ScVZjbFRtNWJYZUFHQyd9IiwiYXV0aG9yaXRpZXMiOlsic2FyZ2F6byJdLCJpYXQiOjE2NTk5NDEyODZ9.qd17vj3iTjaGnB8w8wq4Eb-44o_2Zcy-x1o8vF9WvRmYGYupShpLaYXK8vL7FxxXy5MDIlOIhnTCQL-rpUw_ow',
          'Content-Type': 'application/json',
          'Origin': 'https://app.semarnat.gob.mx',
          'Connection': 'keep-alive',
          'Referer': 'https://app.semarnat.gob.mx/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'DNT': '1',
          'Sec-GPC': '1'
        },
        body: JSON.stringify({ numBitacora })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: 'Error al consultar el historial de SEMARNAT', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error en la petición del historial a SEMARNAT:', error)
    return NextResponse.json(
      { error: 'Error al procesar la petición', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

