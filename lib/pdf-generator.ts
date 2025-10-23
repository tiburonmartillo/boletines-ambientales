import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Genera un PDF del resumen de boletín usando html2canvas y jsPDF
 */
export async function generateBoletinPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId)
  
  if (!element) {
    throw new Error(`Elemento con ID '${elementId}' no encontrado`)
  }

  try {
    // Mostrar loading o indicador de progreso
    const loadingElement = document.createElement('div')
    loadingElement.innerHTML = 'Generando PDF...'
    loadingElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 9999;
      font-family: Arial, sans-serif;
    `
    document.body.appendChild(loadingElement)

    // Cambiar todos los mapas a modo estático temporalmente
    const iframes = element.querySelectorAll('iframe')
    const originalSrcs: string[] = []
    const staticImages: HTMLImageElement[] = []
    
    // Reemplazar iframes con imágenes estáticas
    iframes.forEach((iframe, index) => {
      const src = iframe.getAttribute('src')
      if (src && src.includes('openstreetmap.org')) {
        originalSrcs[index] = src
        
        // Extraer coordenadas del src del iframe
        const bboxMatch = src.match(/bbox=([^&]+)/)
        if (bboxMatch) {
          const bbox = bboxMatch[1].split(',')
          const lng = (parseFloat(bbox[0]) + parseFloat(bbox[2])) / 2
          const lat = (parseFloat(bbox[1]) + parseFloat(bbox[3])) / 2
          
          // Crear imagen estática
          const img = document.createElement('img')
          const staticMapUrl = `https://staticmap.openstreetmap.fr/staticmap.php?center=${lat},${lng}&zoom=15&size=400x300&markers=${lat},${lng},red&maptype=mapnik`
          img.src = staticMapUrl
          img.style.width = '100%'
          img.style.height = '100%'
          img.style.border = '1px solid #e0e0e0'
          img.style.borderRadius = '4px'
          img.style.objectFit = 'cover'
          
          // Reemplazar iframe con imagen
          iframe.parentNode?.replaceChild(img, iframe)
          staticImages.push(img)
        }
      }
    })

    // Esperar a que las imágenes se carguen con un timeout
    await Promise.all(staticImages.map(img => 
      new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), 5000) // Timeout de 5 segundos
        
        if (img.complete) {
          clearTimeout(timeout)
          resolve()
        } else {
          img.onload = () => {
            clearTimeout(timeout)
            resolve()
          }
          img.onerror = () => {
            clearTimeout(timeout)
            resolve() // Continuar aunque falle la carga
          }
        }
      })
    ))

    // Esperar un poco más para asegurar que todo esté renderizado
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Configuración mejorada para html2canvas
    const canvas = await html2canvas(element, {
      scale: 1.5, // Reducir escala para mejor rendimiento
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true,
      removeContainer: false,
      imageTimeout: 15000, // Timeout más largo para imágenes
      onclone: (clonedDoc) => {
        // Asegurar que las imágenes en el documento clonado estén cargadas
        const clonedImages = clonedDoc.querySelectorAll('img')
        clonedImages.forEach(img => {
          if (img.src && img.src.includes('staticmap.openstreetmap.fr')) {
            // Forzar recarga de la imagen
            const newSrc = img.src + '&t=' + Date.now()
            img.src = newSrc
          }
        })
      }
    })

    // Restaurar iframes originales
    staticImages.forEach((img, index) => {
      const iframe = document.createElement('iframe')
      iframe.src = originalSrcs[index]
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.border = '1px solid #e0e0e0'
      iframe.style.borderRadius = '4px'
      img.parentNode?.replaceChild(iframe, img)
    })

    // Remover loading
    document.body.removeChild(loadingElement)

    // Crear PDF
    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Dimensiones de la página A4
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Calcular dimensiones de la imagen
    const imgWidth = pageWidth - 20 // Margen de 10mm en cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Si la imagen es más alta que la página, dividir en múltiples páginas
    if (imgHeight <= pageHeight - 20) {
      // Una sola página
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
    } else {
      // Múltiples páginas
      let yPosition = 10
      let remainingHeight = imgHeight
      let sourceY = 0
      const pageContentHeight = pageHeight - 20

      while (remainingHeight > 0) {
        const currentPageHeight = Math.min(remainingHeight, pageContentHeight)
        const sourceHeight = (currentPageHeight * canvas.height) / imgHeight

        // Crear canvas para la porción de la página actual
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = sourceHeight
        const pageCtx = pageCanvas.getContext('2d')
        
        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          )
        }

        const pageImgData = pageCanvas.toDataURL('image/png', 1.0)
        pdf.addImage(pageImgData, 'PNG', 10, yPosition, imgWidth, currentPageHeight)

        remainingHeight -= currentPageHeight
        sourceY += sourceHeight

        if (remainingHeight > 0) {
          pdf.addPage()
          yPosition = 10
        }
      }
    }

    // Descargar el PDF
    pdf.save(filename)

  } catch (error) {
    console.error('Error al generar PDF:', error)
    throw new Error('Error al generar el PDF. Por favor, intenta de nuevo.')
  }
}

/**
 * Genera un PDF optimizado para impresión
 */
export async function generateBoletinPDFOptimized(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId)
  
  if (!element) {
    throw new Error(`Elemento con ID '${elementId}' no encontrado`)
  }

  try {
    // Ocultar elementos que no deben aparecer en PDF
    const elementsToHide = element.querySelectorAll('.no-print')
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.display = 'none'
    })

    // Configuración optimizada para PDF
    const canvas = await html2canvas(element, {
      scale: 1.5, // Resolución balanceada
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      ignoreElements: (element) => {
        return element.classList.contains('no-print')
      }
    })

    // Restaurar elementos ocultos
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.display = ''
    })

    // Crear PDF con configuración optimizada
    const imgData = canvas.toDataURL('image/jpeg', 0.9) // JPEG para menor tamaño
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    if (imgHeight <= pageHeight - 20) {
      pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight)
    } else {
      // Lógica para múltiples páginas (igual que arriba)
      let yPosition = 10
      let remainingHeight = imgHeight
      let sourceY = 0
      const pageContentHeight = pageHeight - 20

      while (remainingHeight > 0) {
        const currentPageHeight = Math.min(remainingHeight, pageContentHeight)
        const sourceHeight = (currentPageHeight * canvas.height) / imgHeight

        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = sourceHeight
        const pageCtx = pageCanvas.getContext('2d')
        
        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          )
        }

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.9)
        pdf.addImage(pageImgData, 'JPEG', 10, yPosition, imgWidth, currentPageHeight)

        remainingHeight -= currentPageHeight
        sourceY += sourceHeight

        if (remainingHeight > 0) {
          pdf.addPage()
          yPosition = 10
        }
      }
    }

    pdf.save(filename)

  } catch (error) {
    console.error('Error al generar PDF optimizado:', error)
    throw new Error('Error al generar el PDF. Por favor, intenta de nuevo.')
  }
}

/**
 * Genera un PDF usando un enfoque alternativo más robusto
 */
export async function generateBoletinPDFRobust(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId)
  
  if (!element) {
    throw new Error(`Elemento con ID '${elementId}' no encontrado`)
  }

  try {
    // Mostrar loading
    const loadingElement = document.createElement('div')
    loadingElement.innerHTML = `
      <div style="text-align: center; color: white;">
        <div style="margin-bottom: 10px;">Generando PDF...</div>
        <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #F97316; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
      </div>
    `
    loadingElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 30px;
      border-radius: 12px;
      z-index: 9999;
      font-family: Arial, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `

    // Agregar CSS para la animación
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(loadingElement)

    // Crear un contenedor temporal para el PDF
    const tempContainer = document.createElement('div')
    tempContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 210mm;
      background: white;
      padding: 20px;
      font-family: Arial, sans-serif;
    `

    // Clonar el contenido del elemento
    const clonedElement = element.cloneNode(true) as HTMLElement
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)

    // Reemplazar iframes con imágenes estáticas en el clon
    const iframes = clonedElement.querySelectorAll('iframe')
    const imagePromises: Promise<void>[] = []

    iframes.forEach((iframe) => {
      const src = iframe.getAttribute('src')
      if (src && src.includes('openstreetmap.org')) {
        // Extraer coordenadas del src del iframe
        const bboxMatch = src.match(/bbox=([^&]+)/)
        if (bboxMatch) {
          const bbox = bboxMatch[1].split(',')
          const lng = (parseFloat(bbox[0]) + parseFloat(bbox[2])) / 2
          const lat = (parseFloat(bbox[1]) + parseFloat(bbox[3])) / 2
          
          // Crear imagen estática
          const img = document.createElement('img')
          const staticMapUrl = `https://staticmap.openstreetmap.fr/staticmap.php?center=${lat},${lng}&zoom=15&size=400x300&markers=${lat},${lng},red&maptype=mapnik&t=${Date.now()}`
          
          const imagePromise = new Promise<void>((resolve) => {
            img.onload = () => resolve()
            img.onerror = () => resolve() // Continuar aunque falle
            img.src = staticMapUrl
          })
          
          imagePromises.push(imagePromise)
          
          // Reemplazar iframe con imagen
          img.style.cssText = `
            width: 100%;
            height: 100%;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            object-fit: cover;
          `
          
          iframe.parentNode?.replaceChild(img, iframe)
        }
      }
    })

    // Esperar a que todas las imágenes se carguen
    await Promise.all(imagePromises)
    
    // Esperar un poco más para asegurar renderizado
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generar canvas con configuración optimizada
    const canvas = await html2canvas(tempContainer, {
      scale: 1.2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: tempContainer.scrollWidth,
      height: tempContainer.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true,
      removeContainer: false,
      imageTimeout: 20000,
    })

    // Limpiar contenedor temporal
    document.body.removeChild(tempContainer)
    document.body.removeChild(loadingElement)
    document.head.removeChild(style)

    // Crear PDF
    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Dimensiones de la página A4
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Calcular dimensiones de la imagen
    const imgWidth = pageWidth - 20 // Margen de 10mm en cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Si la imagen es más alta que la página, dividir en múltiples páginas
    if (imgHeight <= pageHeight - 20) {
      // Una sola página
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
    } else {
      // Múltiples páginas
      let yPosition = 10
      let remainingHeight = imgHeight
      let sourceY = 0
      const pageContentHeight = pageHeight - 20

      while (remainingHeight > 0) {
        const currentPageHeight = Math.min(remainingHeight, pageContentHeight)
        const sourceHeight = (currentPageHeight * canvas.height) / imgHeight

        // Crear canvas para la porción de la página actual
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = sourceHeight
        const pageCtx = pageCanvas.getContext('2d')
        
        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          )
        }

        const pageImgData = pageCanvas.toDataURL('image/png', 1.0)
        pdf.addImage(pageImgData, 'PNG', 10, yPosition, imgWidth, currentPageHeight)

        remainingHeight -= currentPageHeight
        sourceY += sourceHeight

        if (remainingHeight > 0) {
          pdf.addPage()
          yPosition = 10
        }
      }
    }

    // Descargar el PDF
    pdf.save(filename)

  } catch (error) {
    console.error('Error al generar PDF robusto:', error)
    throw new Error('Error al generar el PDF. Por favor, intenta de nuevo.')
  }
}

/**
 * Función de utilidad para mostrar progreso de generación
 */
export function showPDFProgress(message: string = 'Generando PDF...'): () => void {
  const loadingElement = document.createElement('div')
  loadingElement.innerHTML = `
    <div style="text-align: center;">
      <div style="margin-bottom: 10px;">${message}</div>
      <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #F97316; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
    </div>
  `
  loadingElement.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.9);
    color: white;
    padding: 30px;
    border-radius: 12px;
    z-index: 9999;
    font-family: Arial, sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  `

  // Agregar CSS para la animación
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
  document.body.appendChild(loadingElement)

  // Retornar función para remover el loading
  return () => {
    if (document.body.contains(loadingElement)) {
      document.body.removeChild(loadingElement)
    }
    if (document.head.contains(style)) {
      document.head.removeChild(style)
    }
  }
}
