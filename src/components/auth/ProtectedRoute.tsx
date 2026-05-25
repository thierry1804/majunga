import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import LoginForm from './LoginForm'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireEditor?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireEditor = false 
}: ProtectedRouteProps) {
  const { user, profile, loading, canAccessAdmin, isAdmin, refreshProfile } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  // Si l'utilisateur est connecté mais n'a pas de profil
  if (!profile) {
    const handleRefresh = async () => {
      console.log('Tentative de récupération du profil...')
      await refreshProfile()
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Profil non trouvé
          </h2>
          <p className="text-gray-600">
            Impossible de récupérer votre profil. Si votre profil existe dans la base de données, cliquez sur "Récupérer mon profil".
          </p>
          <p className="text-sm text-orange-600 mt-2">
            💡 Si vous voyez une erreur 500 dans la console, exécutez le script <code className="bg-gray-100 px-1 rounded">fix-profile-read-access.sql</code> dans l'éditeur SQL de Supabase.
          </p>
          <p className="text-sm text-gray-500">
            Email : {user.email}
          </p>
          <div className="pt-4 space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : 'Récupérer mon profil'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Recharger la page
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Accès refusé
          </h2>
          <p className="mt-2 text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Rôle actuel : {profile?.role || 'Non défini'}
          </p>
        </div>
      </div>
    )
  }

  if (requireEditor && !canAccessAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Accès refusé
          </h2>
          <p className="mt-2 text-gray-600">
            Vous devez être éditeur ou administrateur pour accéder à cette page.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Rôle actuel : {profile?.role || 'Non défini'}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
