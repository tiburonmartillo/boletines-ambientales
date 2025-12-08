# Prompt para crear script de extracción de datos SEMARNAT

Crea un script Node.js llamado `scripts/enrich-gacetas-with-semarnat.js` que:

## Objetivo
Extraer información del API de SEMARNAT para cada registro en el JSON de gacetas y agregarla directamente al archivo JSON, evitando así llamadas API en tiempo de ejecución.

## Estructura del JSON
El archivo `public/data/gacetas_semarnat_analizadas.json` tiene esta estructura:
```json
{
  "metadata": { ... },
  "analyses": [
    {
      "gaceta_id": "47-20",
      "analisis_completo": {
        "registros": [
          {
            "id": "01AG2019HD049",
            "clave_proyecto": "01AG2019HD049",
            "tipo_registro": "resolutivo_emitido",
            ...
          }
        ]
      }
    }
  ]
}
```

## Requisitos del script

1. **Leer el JSON**: Cargar `public/data/gacetas_semarnat_analizadas.json`

2. **Para cada registro** en `analyses[].analisis_completo.registros[]`:
   - Si el registro tiene `clave_proyecto`:
     - Hacer petición POST a `https://apps1.semarnat.gob.mx/ws-bitacora-tramite/proyectos/search-files` con body `{"clave": "clave_proyecto"}`
     - Guardar la respuesta completa en un campo `semarnat_data` del registro
   
   - Si el registro tiene `id` (que puede estar en formato "01/MA-0014/08/20" o similar):
     - Hacer petición POST a `https://apps1.semarnat.gob.mx/ws-bitacora-tramite/historial/search-historial-bitacora` con body `{"numBitacora": "id"}`
     - Guardar la respuesta completa en un campo `semarnat_historial` del registro

3. **Headers para las peticiones**:
```javascript
{
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.5',
  'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJzZW1hcm5hdEpXVCIsInN1YiI6IlVzdWFyaW97c2VnVXN1YXJpb3NJZDoxLHNlZ1VzdWFyaW9zTm9tYnJlVXN1YXJpbzogJ2FuYV9vbHZlcmFfc2FyZ2F6bycsc2VnVXN1YXJpb3NQYXNzd29yZDogJyQyYSQxMCRqb21vU2JCT0VycWhoWmU3cEFER2J1WjA4ZDhhUUpucEk0dkhOZU9ScVZjbFRtNWJYZUFHQyd9IiwiYXV0aG9yaXRpZXMiOlsic2FyZ2F6byJdLCJpYXQiOjE2NTk5NDEyODZ9.qd17vj3iTjaGnB8w8wq4Eb-44o_2Zcy-x1o8vF9WvRmYGYupShpLaYXK8vL7FxxXy5MDIlOIhnTCQL-rpUw_ow',
  'Content-Type': 'application/json',
  'Origin': 'https://app.semarnat.gob.mx',
  'Referer': 'https://app.semarnat.gob.mx/',
}
```

4. **Manejo de errores**:
   - Si una petición falla, guardar `null` o un objeto con `{ error: "mensaje" }` en lugar de la data
   - Continuar con los siguientes registros aunque alguno falle
   - Mostrar progreso en consola (ej: "Procesando registro X de Y")

5. **Rate limiting**:
   - Agregar un delay de 500ms-1000ms entre peticiones para no sobrecargar el API
   - Usar `setTimeout` o una función async con `await new Promise(resolve => setTimeout(resolve, delay))`

6. **Guardar resultados**:
   - Guardar el JSON actualizado en el mismo archivo o crear un backup antes
   - Agregar timestamp en metadata sobre cuándo se ejecutó el enriquecimiento

7. **Opcional - Resume/Checkpoint**:
   - Verificar si un registro ya tiene `semarnat_data` y `semarnat_historial` para no repetir peticiones
   - Permitir reanudar desde donde se quedó si se interrumpe

## Estructura final del registro enriquecido:
```json
{
  "id": "01AG2019HD049",
  "clave_proyecto": "01AG2019HD049",
  "tipo_registro": "resolutivo_emitido",
  ...campos existentes...,
  "semarnat_data": {
    "resumen": "/edoc/documentos/...",
    "estudio": "/edoc/documentos/...",
    "resolutivo": "/edoc/documentos/...",
    ...resto de respuesta del API...
  },
  "semarnat_historial": {
    "historial": [
      {
        "historialFechaTurn": "...",
        "descipcionSituacion": "..."
      }
    ],
    ...resto de respuesta del API...
  }
}
```

## Ejemplo de uso:
```bash
node scripts/enrich-gacetas-with-semarnat.js
```

## Características adicionales:
- Logging detallado de progreso y errores
- Estadísticas al final (total procesados, exitosos, fallidos)
- Opción de procesar solo registros nuevos (sin `semarnat_data`)
- Guardar en archivo diferente primero para revisar antes de reemplazar

