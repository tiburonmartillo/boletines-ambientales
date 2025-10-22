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

    // Configuración para html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Mayor resolución
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0
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
