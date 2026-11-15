import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Lock, AlertCircle, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!token) {
      setError('Token de réinitialisation manquant dans l\'URL')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    try {
      const { error } = await updatePassword(password, undefined, token)

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          navigate('/admin')
        }, 2000)
      }
    } catch {
      setError('Une erreur inattendue s\'est produite')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-ocean-100">
            <Lock className="h-6 w-6 text-ocean-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-ink">
            Nouveau mot de passe
          </h2>
          <p className="mt-2 text-center text-sm text-ink-muted">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>

        {success ? (
          <div className="rounded-md bg-ocean-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-ocean-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-ocean-800">
                  Mot de passe mis à jour
                </h3>
                <div className="mt-2 text-sm text-ocean-700">
                  Votre mot de passe a été changé avec succès. Redirection...
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink-muted">
                  Nouveau mot de passe
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-ink-light" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-sand-300 placeholder-ink-light text-ink focus:outline-none focus:ring-ocean-500 focus:border-ocean-500 focus:z-10 sm:text-sm"
                    placeholder="Minimum 6 caractères"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-ink-muted">
                  Confirmer le mot de passe
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-ink-light" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-sand-300 placeholder-ink-light text-ink focus:outline-none focus:ring-ocean-500 focus:border-ocean-500 focus:z-10 sm:text-sm"
                    placeholder="Confirmez votre mot de passe"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ocean-600 hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mise à jour...
                  </div>
                ) : (
                  'Mettre à jour le mot de passe'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
