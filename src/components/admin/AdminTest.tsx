import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      // Test de connexion basique
      const { data, error } = await supabase
        .from('tours')
        .select('count')
        .limit(1)

      if (error) {
        setError(`Erreur Supabase: ${error.message}`)
        setConnectionStatus('❌ Erreur de connexion')
      } else {
        setConnectionStatus('✅ Connexion Supabase OK')
      }
    } catch (err) {
      setError(`Erreur: ${err}`)
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
            <h3 className="text-sm font-medium text-blue-800">Variables d'environnement :</h3>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Configurée' : '❌ Manquante'}</p>
              <p>SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurée' : '❌ Manquante'}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={testSupabaseConnection}
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
