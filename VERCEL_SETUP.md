# Guía de Configuración para Vercel

Este proyecto está configurado para desplegarse en Vercel con soporte para API routes (serverless functions).

## Pasos para Importar el Proyecto en Vercel

### 1. Importar el Repositorio

1. Ve a [vercel.com](https://vercel.com) y inicia sesión
2. Haz clic en **"Add New Project"** o **"Import Project"**
3. Selecciona el repositorio `tiburonmartillo/boletines-ambientales` desde GitHub
4. Si no lo ves, autoriza la conexión entre Vercel y GitHub

### 2. Configuración del Proyecto

Vercel detectará automáticamente que es un proyecto Next.js. La configuración automática será:

- **Framework Preset**: Next.js (detectado automáticamente)
- **Root Directory**: `./` (raíz del proyecto)
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático para Next.js)
- **Install Command**: `npm install` (automático)
- **Node.js Version**: 18.x o superior (recomendado 20.x)

### 3. Variables de Entorno (Opcional)

**No se requieren variables de entorno** para este proyecto. Las API routes usan un token de autorización hardcodeado que funciona sin configuración adicional.

Si en el futuro necesitas configurar variables de entorno:
- Ve a **Project Settings** → **Environment Variables**
- Agrega las variables necesarias para Production, Preview y Development

### 4. Configuración de Dominio Personalizado (Opcional)

Si tienes un dominio personalizado:

1. Ve a **Project Settings** → **Domains**
2. Agrega tu dominio
3. Sigue las instrucciones para configurar los registros DNS

### 5. Configuración de Build (No Requerida)

El proyecto ya está configurado correctamente en `next.config.mjs`:

```javascript
// Ya configurado:
// - Sin output: 'export' (permite API routes)
// - trailingSlash: true
// - images unoptimized: true
// - Sin source maps en producción
```

### 6. API Routes Configuradas

Las siguientes API routes funcionarán automáticamente como serverless functions:

- `/api/semarnat-proyecto` - Consulta información de proyectos SEMARNAT
- `/api/semarnat-historial` - Consulta historial de trámites
- `/api/semarnat-pdf` - Descarga de PDFs de documentos
- `/api/subscribe` - Suscripción a boletines

### 7. Desplegar

1. Haz clic en **"Deploy"**
2. Vercel construirá y desplegará automáticamente
3. Recibirás una URL única para tu proyecto (ej: `tu-proyecto.vercel.app`)

## Despliegues Automáticos

Después de la configuración inicial:

- **Cada push a `main`**: Se desplegará automáticamente a producción
- **Pull Requests**: Se crearán preview deployments automáticos
- **Builds**: Se ejecutan automáticamente en la infraestructura de Vercel

## Verificación Post-Despliegue

Después del despliegue, verifica que:

1. ✅ La página principal carga correctamente
2. ✅ Las páginas de gacetas y boletines funcionan
3. ✅ El modal de gacetas abre correctamente
4. ✅ Las API routes responden:
   - Abre DevTools → Network
   - Intenta abrir un registro en el modal de gacetas
   - Verifica que las llamadas a `/api/semarnat-*` respondan correctamente

## Configuración de Vercel (vercel.json) - NO REQUERIDA

**No necesitas crear un archivo `vercel.json`** porque:
- Next.js se detecta automáticamente
- Las API routes funcionan sin configuración adicional
- El routing funciona con el sistema de archivos de Next.js

Si necesitas configuraciones avanzadas en el futuro, puedes crear `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## Solución de Problemas

### Error: "Build Failed"

- Verifica que `package.json` tenga todas las dependencias necesarias
- Revisa los logs de build en Vercel Dashboard
- Asegúrate de que Node.js version sea 18+ (preferible 20)

### Error: "API Route not found"

- Verifica que las rutas estén en `app/api/`
- Confirma que no haya `output: 'export'` en `next.config.mjs`
- Revisa los logs de la función en Vercel Dashboard

### Error: "CORS Error" o "API External Error"

- Las API routes hacen fetch a APIs externas de SEMARNAT
- Verifica que las URLs de las APIs estén correctas en los archivos route.ts
- Revisa los logs de las serverless functions en Vercel

## Recursos

- [Documentación de Next.js en Vercel](https://nextjs.org/docs/deployment)
- [Documentación de Vercel](https://vercel.com/docs)
- [API Routes en Vercel](https://vercel.com/docs/functions/serverless-functions)

