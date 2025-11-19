"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Box, Typography } from "@mui/material"

interface VersionToggleProps {
  onVersionChange?: (version: "v1" | "v2") => void
}

export function VersionToggle({ onVersionChange }: VersionToggleProps) {
  const [version, setVersion] = useState<"v1" | "v2">("v1")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Cargar preferencia guardada
    const savedVersion = localStorage.getItem("boletines-version") as "v1" | "v2" | null
    if (savedVersion) {
      setVersion(savedVersion)
      onVersionChange?.(savedVersion)
    }
  }, [onVersionChange])

  const handleToggle = (checked: boolean) => {
    const newVersion = checked ? "v2" : "v1"
    setVersion(newVersion)
    localStorage.setItem("boletines-version", newVersion)
    onVersionChange?.(newVersion)
  }

  if (!mounted) {
    return null
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid rgba(30, 58, 138, 0.1)",
        mb: 2,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: "medium", color: "text.secondary" }}>
        Vista clásica
      </Typography>
      <Switch
        checked={version === "v2"}
        onCheckedChange={handleToggle}
        aria-label="Alternar entre vista clásica y vista alternativa"
      />
      <Typography variant="body2" sx={{ fontWeight: "medium", color: "text.secondary" }}>
        Vista ciudadana
      </Typography>
    </Box>
  )
}

