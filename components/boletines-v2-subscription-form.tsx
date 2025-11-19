"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mail } from "lucide-react"

interface BoletinesV2SubscriptionFormProps {
  municipios?: string[]
  onSuccess?: () => void
}

export function BoletinesV2SubscriptionForm({
  municipios = [],
  onSuccess
}: BoletinesV2SubscriptionFormProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [intereses, setIntereses] = useState<string[]>([])
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string>("")
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})

  const opcionesIntereses = [
    { id: "todos", label: "Todos los boletines" },
    { id: "proyectos_nuevos", label: "Solo proyectos nuevos" },
    { id: "resolutivos", label: "Solo resolutivos emitidos" },
    { id: "municipio", label: "Filtrado por municipio" },
  ]

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    // Validar email
    if (!email.trim()) {
      nuevosErrores.email = "El correo electrónico es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nuevosErrores.email = "El formato del correo electrónico no es válido"
    }

    // Validar intereses
    if (intereses.length === 0) {
      nuevosErrores.intereses = "Selecciona al menos un interés"
    }

    // Validar municipio si se seleccionó "municipio" en intereses
    if (intereses.includes("municipio") && !municipioSeleccionado) {
      nuevosErrores.municipio = "Selecciona un municipio"
    }

    // Validar términos
    if (!aceptaTerminos) {
      nuevosErrores.terminos = "Debes aceptar los términos y condiciones"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleInteresChange = (interesId: string, checked: boolean) => {
    if (checked) {
      setIntereses([...intereses, interesId])
    } else {
      setIntereses(intereses.filter((id) => id !== interesId))
      // Si se desmarca "municipio", limpiar municipio seleccionado
      if (interesId === "municipio") {
        setMunicipioSeleccionado("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrige los errores en el formulario",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setErrores({})

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          intereses: intereses,
          municipio: intereses.includes("municipio") ? municipioSeleccionado : null,
          fuente: "boletines-ssmaa-v2",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409 || data.error === "EMAIL_DUPLICADO") {
          toast({
            title: "Correo ya suscrito",
            description: "Este correo electrónico ya está registrado en nuestro sistema.",
            variant: "destructive",
          })
        } else {
          throw new Error(data.message || "Error al procesar la suscripción")
        }
        return
      }

      // Éxito
      toast({
        title: "¡Suscripción exitosa!",
        description: "Te notificaremos cuando haya nuevos boletines según tus preferencias.",
      })

      // Limpiar formulario
      setEmail("")
      setIntereses([])
      setMunicipioSeleccionado("")
      setAceptaTerminos(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error al suscribirse:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al procesar tu suscripción. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" aria-hidden="true" />
          Recibe actualizaciones por correo
        </CardTitle>
        <CardDescription>
          Suscríbete para recibir notificaciones cuando se publiquen nuevos boletines ambientales.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Correo electrónico <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errores.email) {
                  setErrores({ ...errores, email: "" })
                }
              }}
              placeholder="tu@correo.com"
              aria-invalid={!!errores.email}
              aria-describedby={errores.email ? "email-error" : undefined}
              disabled={isSubmitting}
            />
            {errores.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errores.email}
              </p>
            )}
          </div>

          {/* Intereses */}
          <div className="space-y-3">
            <Label>
              Intereses <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-2">
              {opcionesIntereses.map((opcion) => (
                <div key={opcion.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`interes-${opcion.id}`}
                    checked={intereses.includes(opcion.id)}
                    onCheckedChange={(checked) =>
                      handleInteresChange(opcion.id, checked === true)
                    }
                    disabled={isSubmitting}
                    aria-describedby={
                      opcion.id === "municipio" && intereses.includes("municipio")
                        ? "municipio-select"
                        : undefined
                    }
                  />
                  <Label
                    htmlFor={`interes-${opcion.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {opcion.label}
                  </Label>
                </div>
              ))}
            </div>
            {errores.intereses && (
              <p className="text-sm text-destructive">{errores.intereses}</p>
            )}

            {/* Selector de municipio (si se seleccionó "municipio") */}
            {intereses.includes("municipio") && municipios.length > 0 && (
              <div className="ml-6 mt-2 space-y-2">
                <Label htmlFor="municipio">
                  Municipio <span className="text-destructive">*</span>
                </Label>
                <select
                  id="municipio"
                  value={municipioSeleccionado}
                  onChange={(e) => {
                    setMunicipioSeleccionado(e.target.value)
                    if (errores.municipio) {
                      setErrores({ ...errores, municipio: "" })
                    }
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                  aria-invalid={!!errores.municipio}
                  aria-describedby={errores.municipio ? "municipio-error" : undefined}
                >
                  <option value="">Selecciona un municipio</option>
                  {municipios.map((municipio) => (
                    <option key={municipio} value={municipio}>
                      {municipio}
                    </option>
                  ))}
                </select>
                {errores.municipio && (
                  <p id="municipio-error" className="text-sm text-destructive">
                    {errores.municipio}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Términos y condiciones */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terminos"
                checked={aceptaTerminos}
                onCheckedChange={(checked) => {
                  setAceptaTerminos(checked === true)
                  if (errores.terminos) {
                    setErrores({ ...errores, terminos: "" })
                  }
                }}
                disabled={isSubmitting}
                aria-invalid={!!errores.terminos}
              />
              <Label htmlFor="terminos" className="text-sm font-normal cursor-pointer">
                Acepto los{" "}
                <a
                  href="#"
                  className="underline hover:text-foreground"
                  onClick={(e) => {
                    e.preventDefault()
                    // Aquí se podría abrir un modal con los términos
                  }}
                >
                  términos y condiciones
                </a>{" "}
                <span className="text-destructive">*</span>
              </Label>
            </div>
            {errores.terminos && (
              <p className="text-sm text-destructive ml-6">{errores.terminos}</p>
            )}
          </div>

          {/* Botón de envío */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Procesando...
              </>
            ) : (
              "Suscribirse"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

