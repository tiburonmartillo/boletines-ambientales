"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface TableViewToggleProps {
  viewMode: "cards" | "table"
  onViewModeChange: (mode: "cards" | "table") => void
  disabled?: boolean
}

export function TableViewToggle({ viewMode, onViewModeChange, disabled = false }: TableViewToggleProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('TableViewToggle mounted, viewMode:', viewMode)
    setMounted(true)
  }, [viewMode])

  const handleToggle = (checked: boolean) => {
    if (disabled) return
    console.log('Toggle clicked, checked:', checked, 'current viewMode:', viewMode)
    const newMode = checked ? "table" : "cards"
    console.log('Setting new mode:', newMode)
    if (onViewModeChange) {
      onViewModeChange(newMode)
      localStorage.setItem("boletines-view-mode", newMode)
    } else {
      console.error('onViewModeChange is not defined!')
    }
  }

  const handleLabelClick = (mode: "cards" | "table") => {
    if (disabled) return
    console.log('Label clicked, mode:', mode, 'current viewMode:', viewMode)
    if (viewMode !== mode && onViewModeChange) {
      onViewModeChange(mode)
      localStorage.setItem("boletines-view-mode", mode)
    }
  }

  return (
    <div className="flex items-center gap-3 min-w-[180px]">
      <Label 
        htmlFor="table-view-toggle" 
        className="text-lg font-bold text-black cursor-pointer whitespace-nowrap"
        onClick={() => handleLabelClick("cards")}
      >
        Cards
      </Label>
      <Switch
        id="table-view-toggle"
        checked={viewMode === "table"}
        onCheckedChange={handleToggle}
        aria-label="Alternar entre vista de cards y tabla"
        className="shrink-0 scale-150"
        disabled={disabled}
      />
      <Label 
        htmlFor="table-view-toggle" 
        className="text-lg font-bold text-black cursor-pointer whitespace-nowrap"
        onClick={() => handleLabelClick("table")}
      >
        Tabla
      </Label>
    </div>
  )
}

