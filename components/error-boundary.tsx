"use client"

import { Component, ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="p-6 bg-card border-border">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-destructive mb-2">
              Algo salió mal
            </h2>
            <p className="text-muted-foreground mb-4">
              Hubo un error al cargar este componente. Por favor, intenta recargar la página.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Recargar página
            </Button>
          </div>
        </Card>
      )
    }

    return this.props.children
  }
}
