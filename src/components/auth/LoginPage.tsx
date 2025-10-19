import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoginForm from './LoginForm'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleLoginSuccess = () => {
    // Rediriger vers la page d'accueil après connexion réussie
    navigate('/')
  }

  // Si l'utilisateur est déjà connecté, rediriger vers l'accueil
  if (user) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous pour accéder à votre compte
          </p>
        </div>
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  )
}
