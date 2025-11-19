"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface VersionToggleNavbarProps {
  onVersionChange?: (version: "v1" | "v2") => void
}

export function VersionToggleNavbar({ onVersionChange }: VersionToggleNavbarProps) {
  const [version, setVersion] = useState<"v1" | "v2">("v1")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('VersionToggleNavbar mounted');
    setMounted(true)
    // Cargar preferencia guardada
    const savedVersion = localStorage.getItem("boletines-version") as "v1" | "v2" | null
    if (savedVersion) {
      setVersion(savedVersion)
      onVersionChange?.(savedVersion)
    }

    // Escuchar cambios de versión desde otros componentes
    const handleVersionChange = (event: CustomEvent<"v1" | "v2">) => {
      setVersion(event.detail)
    }
    window.addEventListener("boletines-version-change", handleVersionChange as EventListener)

    return () => {
      window.removeEventListener("boletines-version-change", handleVersionChange as EventListener)
    }
  }, [onVersionChange])

  const handleToggle = (checked: boolean) => {
    const newVersion = checked ? "v2" : "v1"
    setVersion(newVersion)
    localStorage.setItem("boletines-version", newVersion)
    onVersionChange?.(newVersion)
    // Disparar evento personalizado para que la página escuche el cambio
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("boletines-version-change", { detail: newVersion }))
    }
  }

  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <Label htmlFor="version-toggle-navbar" className="text-xs font-semibold text-gray-800 cursor-pointer whitespace-nowrap">
        Clásica
      </Label>
      <Switch
        id="version-toggle-navbar"
        checked={mounted ? version === "v2" : false}
        onCheckedChange={handleToggle}
        aria-label="Alternar entre vista clásica y vista ciudadana"
        className="shrink-0"
        disabled={!mounted}
      />
      <Label htmlFor="version-toggle-navbar" className="text-xs font-semibold text-gray-800 cursor-pointer whitespace-nowrap">
        Ciudadana
      </Label>
    </div>
  )
}

