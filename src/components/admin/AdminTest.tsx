import React, { useState, useEffect } from 'react'
import { getEntrypoint, getTours } from '../../api/madabookingApi'

export default function AdminTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testApiConnection()
  }, [])

  const testApiConnection = async () => {
    try {
      // Test de connexion basique à l'API Madabooking
      const entrypoint = await getEntrypoint()
      const tours = await getTours()

      if (entrypoint && tours !== undefined) {
        setConnectionStatus(`✅ Connexion API Madabooking OK (${tours.length} tours disponibles)`)
        setError(null)
      } else {
        setError('Réponse API invalide')
        setConnectionStatus('❌ Erreur de connexion')
      }
    } catch (err: any) {
      setError(`Erreur API: ${err.message || err}`)
      setConnectionStatus('❌ Erreur de connexion')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Test Interface Admin
        </h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-700">Statut de connexion :</h2>
            <p className="text-sm text-gray-600">{connectionStatus}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-red-800">Erreur :</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800">Configuration API :</h3>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>API_URL: {import.meta.env.VITE_MADABOOKING_API_URL || '✅ Auto (dev/prod)'}</p>
              <p>Mode: {import.meta.env.DEV ? '🔧 Développement' : '🚀 Production'}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={testApiConnection}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Tester à nouveau
            </button>
            <a
              href="/"
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-center"
            >
              Retour au site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
