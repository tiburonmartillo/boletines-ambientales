"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FAQItem {
  pregunta: string
  respuesta: string
  fundamentoLegal?: string
}

const faqData: FAQItem[] = [
  {
    pregunta: "¿Qué son los boletines ambientales?",
    respuesta: "Los boletines ambientales son publicaciones oficiales de la Secretaría de Medio Ambiente del Estado de Aguascalientes (SSMAA) que contienen información sobre proyectos ambientales ingresados y resolutivos emitidos. Incluyen detalles sobre manifestaciones de impacto ambiental, estudios de riesgo, informes preventivos y otros trámites ambientales.",
    fundamentoLegal: "Ley General del Equilibrio Ecológico y la Protección al Ambiente, Artículo 35 Bis."
  },
  {
    pregunta: "¿Con qué frecuencia se publican los boletines?",
    respuesta: "Los boletines se publican periódicamente según la actividad de proyectos ambientales en el estado. La frecuencia puede variar, pero generalmente se publican cuando hay nuevos proyectos ingresados o resolutivos emitidos.",
  },
  {
    pregunta: "¿Qué información contiene cada boletín?",
    respuesta: "Cada boletín incluye información sobre proyectos ambientales ingresados (con datos del promovente, nombre del proyecto, tipo de estudio, municipio, giro, etc.) y resolutivos emitidos (con número de oficio, fecha de resolutivo, y relación con proyectos ingresados).",
  },
  {
    pregunta: "¿Cómo puedo acceder a los documentos completos?",
    respuesta: "Cada boletín incluye enlaces a los documentos PDF oficiales publicados en el sitio web de la SSMAA. Puedes hacer clic en 'Ver boletín' o 'Descargar PDF' en cada tarjeta de boletín para acceder al documento completo.",
  },
  {
    pregunta: "¿Qué significa 'estado de cumplimiento'?",
    respuesta: "El estado de cumplimiento indica si un proyecto tiene resolutivo emitido. 'Con resolutivo' significa que ya se emitió una resolución, 'Sin resolutivo' indica que aún está en proceso, y 'En proceso' significa que hay algunos resolutivos pero no todos.",
  },
  {
    pregunta: "¿Puedo recibir notificaciones de nuevos boletines?",
    respuesta: "Sí, puedes suscribirte usando el formulario de suscripción disponible en esta página. Podrás elegir recibir notificaciones sobre todos los boletines, solo proyectos nuevos, solo resolutivos, o filtrados por municipio.",
  },
  {
    pregunta: "¿Esta información es oficial?",
    respuesta: "Sí, toda la información proviene directamente de los boletines oficiales publicados por la Secretaría de Medio Ambiente del Estado de Aguascalientes. Los datos se obtienen de la fuente oficial disponible en el sitio web gubernamental.",
    fundamentoLegal: "Ley de Transparencia y Acceso a la Información Pública del Estado de Aguascalientes."
  },
  {
    pregunta: "¿Cómo puedo buscar información específica?",
    respuesta: "Puedes usar el buscador para encontrar proyectos por nombre, promovente, expediente o municipio. También puedes usar los filtros avanzados para filtrar por año, tipo de proyecto, autoridad, municipio o estado de cumplimiento.",
  },
]

export function BoletinesV2FAQ() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Preguntas Frecuentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.pregunta}
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p className="text-muted-foreground">{item.respuesta}</p>
                {item.fundamentoLegal && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <strong>Fundamento legal:</strong> {item.fundamentoLegal}
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

