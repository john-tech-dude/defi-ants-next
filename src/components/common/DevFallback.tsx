'use client'

import { ReactNode, Component, ErrorInfo } from 'react'
import Button from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface DevFallbackProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

// Error boundary component for development
export class DevFallback extends Component<DevFallbackProps, ErrorBoundaryState> {
  constructor(props: DevFallbackProps) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { 
      hasError: true, 
      error,
      errorInfo: { componentStack: '' } as ErrorInfo
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by DevFallback:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="text-center max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Something went wrong
            </h2>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 text-left">
              <p className="font-medium text-red-700 dark:text-red-300 mb-2">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto max-h-40 mt-2 p-2 bg-white/50 dark:bg-black/20 rounded">
                  {this.state.error.stack}
                </pre>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={this.handleReset}
              className="group"
              size="lg"
            >
              Try Again
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Use this wrapper for Image components to prevent crashes
export function ImageFallback({ src, alt, className, width, height }: { 
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}) {
  return (
    <div 
      className={`bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center ${className}`}
      style={{ width: width || 40, height: height || 40 }}
    >
      <span className="text-xs text-white font-medium">{alt.split(' ')[0]}</span>
    </div>
  )
}
