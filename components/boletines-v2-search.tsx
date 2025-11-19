"use client"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface BoletinesV2SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  resultados?: number
  mostrarSugerencias?: boolean
  onLimpiar?: () => void
}

export function BoletinesV2Search({
  value,
  onChange,
  placeholder = "Buscar por nombre de proyecto, promovente, expediente o municipio...",
  resultados,
  mostrarSugerencias = true,
  onLimpiar
}: BoletinesV2SearchProps) {
  const [isFocused, setIsFocused] = useState(false)

  const ejemplosBusqueda = [
    "Hotel",
    "Planta industrial",
    "Centro comercial",
    "Aguascalientes"
  ]

  const handleClear = () => {
    onChange("")
    onLimpiar?.()
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" 
          aria-hidden="true"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-9 pr-9 h-11"
          aria-label="Campo de búsqueda de boletines"
          aria-describedby={mostrarSugerencias && isFocused && !value ? "search-suggestions" : undefined}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Texto de ayuda cuando está enfocado y vacío */}
      {mostrarSugerencias && isFocused && !value && (
        <Card id="search-suggestions" className="border-dashed">
          <CardContent className="py-3 px-4">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Ejemplos de búsqueda:</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {ejemplosBusqueda.map((ejemplo, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onChange(ejemplo)}
                  className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Buscar: ${ejemplo}`}
                >
                  {ejemplo}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contador de resultados */}
      {resultados !== undefined && value && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {resultados === 0 ? (
            <span className="text-destructive">
              No se encontraron resultados para &quot;{value}&quot;
            </span>
          ) : (
            <>
              {resultados} {resultados === 1 ? "resultado" : "resultados"} para &quot;{value}&quot;
            </>
          )}
        </p>
      )}

      {/* Mensaje de sin resultados con sugerencias */}
      {resultados === 0 && value && (
        <Card className="border-dashed border-muted">
          <CardContent className="py-4 px-4">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Sugerencias:</strong>
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Verifica la ortografía de las palabras clave</li>
              <li>Intenta con términos más generales</li>
              <li>Usa menos palabras en tu búsqueda</li>
              <li>Revisa los filtros aplicados</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

