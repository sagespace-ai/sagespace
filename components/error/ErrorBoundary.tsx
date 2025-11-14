"use client"

import React, { Component, type ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SimpleLogo } from '@/components/branding/SimpleLogo'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Error Boundary Component
 * Catches React errors and displays a graceful fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error in', this.props.componentName || 'component', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })

    // Log to self-healing system
    if (typeof window !== 'undefined') {
      fetch('/api/self-healing/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'error',
          severity: 'high',
          affected_component: this.props.componentName || 'unknown',
          error_details: {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
          },
        }),
      }).catch(console.error)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black flex items-center justify-center p-4">
          {/* Animated stars */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
          </div>

          <Card className="relative w-full max-w-md bg-slate-900/80 border-red-500/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <SimpleLogo size="lg" />
              </div>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                Something Went Wrong
              </CardTitle>
              <CardDescription className="text-slate-400">
                {this.props.componentName
                  ? `The ${this.props.componentName} encountered an error`
                  : 'An unexpected error occurred'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-300 text-sm font-mono break-all mb-2">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="text-red-400 text-xs cursor-pointer">Stack Trace</summary>
                      <pre className="text-red-300 text-xs mt-2 overflow-auto max-h-40">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <Button
                  onClick={this.handleReset}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.href = '/demo'}
                  variant="outline"
                  className="w-full border-slate-700 text-white hover:bg-slate-800"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Return to Hub
                </Button>
              </div>

              <p className="text-center text-slate-500 text-sm">
                The error has been logged and our system is working on a fix.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Lightweight error boundary for inline components
 */
export function InlineErrorBoundary({
  children,
  componentName,
}: {
  children: ReactNode
  componentName?: string
}) {
  return (
    <ErrorBoundary
      componentName={componentName}
      fallback={
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">
            {componentName ? `Error loading ${componentName}` : 'Error loading component'}
          </p>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.location.reload()}
            className="mt-2 text-red-400 hover:text-red-300"
          >
            <RefreshCcw className="mr-1 h-3 w-3" />
            Reload
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
