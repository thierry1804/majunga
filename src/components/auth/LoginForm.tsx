import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToSignUp?: () => void
}

export default function LoginForm({ onSuccess, onSwitchToSignUp }: LoginFormProps) {
  const { t } = useTranslation()
  const { signIn, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message)
      } else {
        onSuccess?.()
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResetSuccess(false)

    try {
      const { error } = await resetPassword(resetEmail)

      if (error) {
        setError(error.message)
      } else {
        setResetSuccess(true)
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite')
    } finally {
      setLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-ocean-100">
              <Mail className="h-6 w-6 text-ocean-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-ink">
              Réinitialiser le mot de passe
            </h2>
            <p className="mt-2 text-center text-sm text-ink-muted">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {resetSuccess ? (
            <div className="rounded-md bg-ocean-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-ocean-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-ocean-800">
                    Email envoyé
                  </h3>
                  <div className="mt-2 text-sm text-ocean-700">
                    Vérifiez votre boîte mail pour le lien de réinitialisation.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
              {error && (
                <div className="rounded-md bg-terracotta-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-terracotta-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-terracotta-600">
                        Erreur
                      </h3>
                      <div className="mt-2 text-sm text-terracotta-600">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-ink-muted">
                  Adresse email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-ink-light" />
                  </div>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-sand-300 placeholder-ink-light text-ink focus:outline-none focus:ring-ocean-500 focus:border-ocean-500 focus:z-10 sm:text-sm"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ocean-600 hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi...
                    </div>
                  ) : (
                    'Envoyer le lien'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setError('')
                    setResetSuccess(false)
                  }}
                  className="w-full text-center text-sm text-ocean-600 hover:text-ocean-500"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-ocean-100">
            <Lock className="h-6 w-6 text-ocean-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-ink">
            Connexion Admin
          </h2>
          <p className="mt-2 text-center text-sm text-ink-muted">
            Accédez à l'interface d'administration MadaBooking
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-terracotta-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-terracotta-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-terracotta-600">
                    Erreur de connexion
                  </h3>
                  <div className="mt-2 text-sm text-terracotta-600">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-muted">
                Adresse email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-ink-light" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-sand-300 placeholder-ink-light text-ink focus:outline-none focus:ring-ocean-500 focus:border-ocean-500 focus:z-10 sm:text-sm"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-muted">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-ink-light" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full pl-10 pr-10 py-2 border border-sand-300 placeholder-ink-light text-ink focus:outline-none focus:ring-ocean-500 focus:border-ocean-500 focus:z-10 sm:text-sm"
                  placeholder="Votre mot de passe"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-ink-light hover:text-ink-light focus:outline-none focus:text-ink-light"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ocean-600 hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-ink-muted hover:text-ocean-600"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>

          {onSwitchToSignUp && (
            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-sm text-ocean-600 hover:text-ocean-500"
              >
                Pas encore de compte ? Créer un compte
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
