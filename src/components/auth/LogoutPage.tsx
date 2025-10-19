import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function LogoutPage() {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  useEffect(() => {
    const handleLogout = async () => {
      if (user) {
        try {
          await signOut()
          console.log('✅ Déconnexion réussie')
        } catch (error) {
          console.error('❌ Erreur lors de la déconnexion:', error)
        }
      }
      
      // Rediriger vers la page d'accueil après déconnexion
      navigate('/', { replace: true })
    }

    handleLogout()
  }, [signOut, navigate, user])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Déconnexion en cours...</p>
      </div>
    </div>
  )
}
