import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  error: string
  onRetry?: () => void
  title?: string
}

export default function ErrorMessage({ error, onRetry, title = "Erreur de chargement" }: ErrorMessageProps) {
  return (
    <div className="bg-terracotta-50 border border-terracotta-100 rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-terracotta-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-terracotta-600">
            {title}
          </h3>
          <div className="mt-2 text-sm text-terracotta-600">
            <p>{error}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-terracotta-600 bg-terracotta-100 hover:bg-terracotta-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
