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
            const newSrc = img.src + '&t=static'
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
 * Genera un PDF usando un enfoque simple y confiable
 */
export async function generateBoletinPDFRobust(elementId: string, filename: string): Promise<void> {
  console.log('generateBoletinPDFRobust: Iniciando generación de PDF para elemento:', elementId)
  
  const element = document.getElementById(elementId)
  
  if (!element) {
    console.error('generateBoletinPDFRobust: Elemento no encontrado:', elementId)
    throw new Error(`Elemento con ID '${elementId}' no encontrado`)
  }

  console.log('generateBoletinPDFRobust: Elemento encontrado:', element)

  try {
    // Mostrar loading simple
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

    console.log('generateBoletinPDFRobust: Iniciando html2canvas...')

    // Configuración simplificada para html2canvas
    const canvas = await html2canvas(element, {
      scale: 1.5, // Reducir escala para mejor rendimiento
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true, // Habilitar logs para debugging
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true,
      removeContainer: false,
      imageTimeout: 15000, // Timeout más largo
      onclone: (clonedDoc) => {
        console.log('generateBoletinPDFRobust: Procesando documento clonado...')
        
        // Mejorar contraste y colores en el documento clonado
        const clonedElement = clonedDoc.getElementById(elementId)
        if (clonedElement) {
          console.log('generateBoletinPDFRobust: Elemento clonado encontrado')
          
          // Forzar estilos para mejor contraste
          clonedElement.style.color = '#000000'
          clonedElement.style.backgroundColor = '#ffffff'
          
          // Mejorar contraste de texto
          const textElements = clonedElement.querySelectorAll('*')
          textElements.forEach(el => {
            const htmlEl = el as HTMLElement
            if (htmlEl.style.color === '' || htmlEl.style.color === 'rgb(107, 114, 128)') {
              htmlEl.style.color = '#000000'
            }
            if (htmlEl.style.backgroundColor === '' || htmlEl.style.backgroundColor === 'rgb(249, 250, 251)') {
              htmlEl.style.backgroundColor = '#ffffff'
            }
          })
          
          // Reemplazar iframes con imágenes estáticas
          const iframes = clonedElement.querySelectorAll('iframe')
          console.log('generateBoletinPDFRobust: Encontrados iframes:', iframes.length)
          
          iframes.forEach((iframe, index) => {
            const src = iframe.getAttribute('src')
            console.log(`generateBoletinPDFRobust: Procesando iframe ${index}:`, src)
            
            if (src && src.includes('openstreetmap.org')) {
              // Extraer coordenadas del src del iframe
              const bboxMatch = src.match(/bbox=([^&]+)/)
              if (bboxMatch) {
                const bbox = bboxMatch[1].split(',')
                const lng = (parseFloat(bbox[0]) + parseFloat(bbox[2])) / 2
                const lat = (parseFloat(bbox[1]) + parseFloat(bbox[3])) / 2
                
                console.log(`generateBoletinPDFRobust: Coordenadas extraídas: lat=${lat}, lng=${lng}`)
                
                // Crear imagen estática directamente
                const img = document.createElement('img')
                // Usar URL estática directa para evitar problemas de DOM
                img.src = `https://staticmap.openstreetmap.fr/staticmap.php?center=${lat},${lng}&zoom=15&size=400x300&markers=${lat},${lng},red&maptype=mapnik&format=png&t=static`
                img.style.cssText = `
                  width: 100%;
                  height: 100%;
                  border: 1px solid #e0e0e0;
                  border-radius: 4px;
                  object-fit: cover;
                  background-color: #f0f0f0;
                `
                
                console.log(`generateBoletinPDFRobust: Reemplazando iframe con imagen`)
                
                // Reemplazar iframe con imagen
                iframe.parentNode?.replaceChild(img, iframe)
              }
            }
          })
        }
      }
    })

    console.log('generateBoletinPDFRobust: html2canvas completado, canvas size:', canvas.width, 'x', canvas.height)

    // Remover loading
    document.body.removeChild(loadingElement)

    // Verificar que el canvas tenga contenido
    if (canvas.width === 0 || canvas.height === 0) {
      console.error('generateBoletinPDFRobust: Canvas vacío')
      throw new Error('No se pudo capturar el contenido del elemento')
    }

    console.log('generateBoletinPDFRobust: Creando PDF...')

    // Crear PDF con mejor calidad
    const imgData = canvas.toDataURL('image/png', 1.0) // Máxima calidad PNG
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false // No comprimir para mantener calidad
    })

    // Dimensiones de la página A4
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Calcular dimensiones de la imagen
    const imgWidth = pageWidth - 20 // Margen de 10mm en cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    console.log('generateBoletinPDFRobust: Dimensiones calculadas - imgWidth:', imgWidth, 'imgHeight:', imgHeight)

    // Si la imagen es más alta que la página, dividir en múltiples páginas
    if (imgHeight <= pageHeight - 20) {
      console.log('generateBoletinPDFRobust: Añadiendo imagen en una sola página')
      // Una sola página
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
    } else {
      console.log('generateBoletinPDFRobust: Dividiendo imagen en múltiples páginas')
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

    console.log('generateBoletinPDFRobust: Iniciando descarga del PDF...')

    // Descargar el PDF
    pdf.save(filename)

    console.log('generateBoletinPDFRobust: PDF generado y descargado exitosamente')

  } catch (error) {
    console.error('generateBoletinPDFRobust: Error al generar PDF:', error)
    
    // Remover loading si existe
    const loadingElement = document.querySelector('div[style*="position: fixed"]')
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement)
    }
    
    throw new Error(`Error al generar el PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

/**
 * Genera una imagen JPG del resumen de boletín usando html2canvas
 */
/**
 * Genera un mapa estático usando la librería tiny-static-map
 * Basado en https://github.com/bopjesvla/tiny-static-map
 */
async function generateStaticMapWithTinyStaticMap(lat: number, lng: number, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Crear un contenedor temporal
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.top = '-9999px'
      tempContainer.style.left = '-9999px'
      tempContainer.style.width = `${width}px`
      tempContainer.style.height = `${height}px`
      document.body.appendChild(tempContainer)

      // Cargar la librería tiny-static-map si no está cargada
      if (typeof (window as any).createStaticMap === 'undefined') {
        const script = document.createElement('script')
        script.src = '/tiny-static-map.js'
        script.onload = () => {
          createStaticMapAndConvert()
        }
        script.onerror = () => {
          reject(new Error('No se pudo cargar tiny-static-map.js'))
        }
        document.head.appendChild(script)
      } else {
        createStaticMapAndConvert()
      }

      function createStaticMapAndConvert() {
        try {
          // Usar la librería tiny-static-map
          ;(window as any).createStaticMap(tempContainer, lat, lng, 15, width, height)
          
          // Esperar a que se carguen las imágenes
          const images = tempContainer.querySelectorAll('img')
          let loadedImages = 0
          
          if (images.length === 0) {
            resolve('') // No hay imágenes, retornar string vacío
            return
          }

          images.forEach(img => {
            img.onload = () => {
              loadedImages++
              if (loadedImages === images.length) {
                convertToDataURL()
              }
            }
            img.onerror = () => {
              loadedImages++
              if (loadedImages === images.length) {
                convertToDataURL()
              }
            }
          })

          // Timeout de seguridad
          setTimeout(() => {
            convertToDataURL()
          }, 5000)

        } catch (error) {
          console.error('Error creando mapa estático:', error)
          reject(error)
        }
      }

      function convertToDataURL() {
        try {
          // Crear un canvas temporal
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('No se pudo crear contexto de canvas'))
            return
          }

          // Dibujar el contenedor en el canvas
          html2canvas(tempContainer, {
            width: width,
            height: height,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          }).then(canvas => {
            const dataURL = canvas.toDataURL('image/png')
            
            // Limpiar el contenedor temporal solo si aún existe
            if (document.body.contains(tempContainer)) {
              document.body.removeChild(tempContainer)
            }
            
            resolve(dataURL)
          }).catch(error => {
            console.error('Error convirtiendo a canvas:', error)
            if (document.body.contains(tempContainer)) {
              document.body.removeChild(tempContainer)
            }
            reject(error)
          })
        } catch (error) {
          console.error('Error en convertToDataURL:', error)
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer)
          }
          reject(error)
        }
      }
    } catch (error) {
      console.error('Error en generateStaticMapWithTinyStaticMap:', error)
      reject(error)
    }
  })
}

export async function generateBoletinJPG(elementId: string, filename: string): Promise<void> {
  console.log('generateBoletinJPG: Iniciando generación de imagen para elemento:', elementId)
  
  const element = document.getElementById(elementId)
  
  if (!element) {
    console.error('generateBoletinJPG: Elemento no encontrado:', elementId)
    throw new Error(`Elemento con ID '${elementId}' no encontrado`)
  }

  console.log('generateBoletinJPG: Elemento encontrado:', element)

  try {
    // Mostrar loading
    const loadingElement = document.createElement('div')
    loadingElement.innerHTML = 'Generando imagen...'
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

    console.log('generateBoletinJPG: Iniciando html2canvas...')

    // Configuración simplificada para html2canvas
    const canvas = await html2canvas(element, {
      scale: 1.5, // Reducir escala para mejor rendimiento
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true, // Habilitar logging para debugging
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true,
      removeContainer: false,
      imageTimeout: 15000, // Timeout más largo
      onclone: (clonedDoc) => {
        console.log('generateBoletinJPG: Procesando documento clonado...')
        
        // Mejorar contraste y colores en el documento clonado
        const clonedElement = clonedDoc.getElementById(elementId)
        if (clonedElement) {
          console.log('generateBoletinJPG: Elemento clonado encontrado')
          
          // Forzar estilos para mejor contraste
          clonedElement.style.color = '#000000'
          clonedElement.style.backgroundColor = '#ffffff'
          
          // Mejorar contraste de texto
          const textElements = clonedElement.querySelectorAll('*')
          textElements.forEach(el => {
            const htmlEl = el as HTMLElement
            if (htmlEl.style.color === '' || htmlEl.style.color === 'rgb(107, 114, 128)') {
              htmlEl.style.color = '#000000'
            }
            if (htmlEl.style.backgroundColor === '' || htmlEl.style.backgroundColor === 'rgb(249, 250, 251)') {
              htmlEl.style.backgroundColor = '#ffffff'
            }
          })
          
          // Reemplazar iframes con imágenes estáticas
          const iframes = clonedElement.querySelectorAll('iframe')
          console.log('generateBoletinJPG: Encontrados iframes:', iframes.length)
          
          iframes.forEach((iframe, index) => {
            const src = iframe.getAttribute('src')
            console.log(`generateBoletinJPG: Procesando iframe ${index}:`, src)
            
            if (src && src.includes('openstreetmap.org')) {
              // Extraer coordenadas del src del iframe
              const bboxMatch = src.match(/bbox=([^&]+)/)
              if (bboxMatch) {
                const bbox = bboxMatch[1].split(',')
                const lng = (parseFloat(bbox[0]) + parseFloat(bbox[2])) / 2
                const lat = (parseFloat(bbox[1]) + parseFloat(bbox[3])) / 2
                
                console.log(`generateBoletinJPG: Coordenadas extraídas: lat=${lat}, lng=${lng}`)
                
                // Crear imagen estática
                const img = document.createElement('img')
                const staticMapUrl = `https://staticmap.openstreetmap.fr/staticmap.php?center=${lat},${lng}&zoom=15&size=400x300&markers=${lat},${lng},red&maptype=mapnik&t=static`
                img.src = staticMapUrl
                img.style.cssText = `
                  width: 100%;
                  height: 100%;
                  border: 1px solid #e0e0e0;
                  border-radius: 4px;
                  object-fit: cover;
                  background-color: #f0f0f0;
                `
                
                console.log(`generateBoletinJPG: Reemplazando iframe con imagen: ${staticMapUrl}`)
                
                // Reemplazar iframe con imagen
                iframe.parentNode?.replaceChild(img, iframe)
              }
            }
          })
        }
      }
    })

    console.log('generateBoletinJPG: html2canvas completado, canvas size:', canvas.width, 'x', canvas.height)

    // Remover loading
    document.body.removeChild(loadingElement)

    // Verificar que el canvas tenga contenido
    if (canvas.width === 0 || canvas.height === 0) {
      console.error('generateBoletinJPG: Canvas vacío')
      throw new Error('No se pudo capturar el contenido del elemento')
    }

    console.log('generateBoletinJPG: Convirtiendo canvas a JPG...')

    // Convertir a JPG y descargar
    const imgData = canvas.toDataURL('image/jpeg', 0.9) // Calidad alta JPG
    
    console.log('generateBoletinJPG: Imagen generada, tamaño:', imgData.length, 'bytes')

    // Crear enlace de descarga
    const link = document.createElement('a')
    link.download = filename.endsWith('.jpg') ? filename : `${filename}.jpg`
    link.href = imgData
    
    console.log('generateBoletinJPG: Iniciando descarga:', link.download)
    
    // Simular click para descargar
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log('generateBoletinJPG: Descarga completada')

  } catch (error) {
    console.error('generateBoletinJPG: Error al generar JPG:', error)
    
    // Remover loading si existe
    const loadingElement = document.querySelector('div[style*="position: fixed"]')
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement)
    }
    
    throw new Error(`Error al generar la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`)
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
