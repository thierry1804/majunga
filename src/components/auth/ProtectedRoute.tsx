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
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-terracotta-100">
            <svg className="h-6 w-6 text-terracotta-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-ink">
            Profil non trouvé
          </h2>
          <p className="text-ink-muted">
            Impossible de récupérer votre profil. Si votre profil existe dans la base de données, cliquez sur "Récupérer mon profil".
          </p>
          <p className="text-sm text-terracotta-500 mt-2">
            💡 Si vous voyez une erreur 500 dans la console, exécutez le script <code className="bg-sand-100 px-1 rounded">fix-profile-read-access.sql</code> dans l'éditeur SQL de Supabase.
          </p>
          <p className="text-sm text-ink-light">
            Email : {user.email}
          </p>
          <div className="pt-4 space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-ocean-600 text-white rounded-md hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-ocean-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : 'Récupérer mon profil'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-ink-muted text-white rounded-md hover:bg-ink-muted focus:outline-none focus:ring-2 focus:ring-ink-light"
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
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-terracotta-100">
            <svg className="h-6 w-6 text-terracotta-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-ink">
            Accès refusé
          </h2>
          <p className="mt-2 text-ink-muted">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <p className="mt-1 text-sm text-ink-light">
            Rôle actuel : {profile?.role || 'Non défini'}
          </p>
        </div>
      </div>
    )
  }

  if (requireEditor && !canAccessAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-terracotta-100">
            <svg className="h-6 w-6 text-terracotta-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-ink">
            Accès refusé
          </h2>
          <p className="mt-2 text-ink-muted">
            Vous devez être éditeur ou administrateur pour accéder à cette page.
          </p>
          <p className="mt-1 text-sm text-ink-light">
            Rôle actuel : {profile?.role || 'Non défini'}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
