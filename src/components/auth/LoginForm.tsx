import React, { useState } from 'react'
import { Mail, Lock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'
import AuthLayout from './AuthLayout'
import { AuthField, PasswordField } from './AuthField'

/** Le serveur répond en anglais : on donne un message clair, qui dit quoi faire. */
function loginErrorMessage(message: string): string {
  if (/invalid credentials|bad credentials|unauthorized/i.test(message)) {
    return 'Adresse e-mail ou mot de passe incorrect. Vérifiez votre saisie et réessayez.'
  }
  if (/too many|trop de/i.test(message)) {
    return 'Trop de tentatives de connexion. Patientez une minute avant de réessayer.'
  }
  if (/failed to fetch|network/i.test(message)) {
    return 'Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.'
  }
  return message
}

interface LoginFormProps {
  onSuccess?: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        setError(loginErrorMessage(error.message))
      } else {
        onSuccess?.()
      }
    } catch {
      setError("Une erreur inattendue s'est produite. Réessayez dans un instant.")
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
    } catch {
      setError("Une erreur inattendue s'est produite. Réessayez dans un instant.")
    } finally {
      setLoading(false)
    }
  }

  const backToLogin = () => {
    setShowForgotPassword(false)
    setError('')
    setResetSuccess(false)
  }

  if (showForgotPassword) {
    return (
      <AuthLayout
        title="Mot de passe oublié"
        description="Indiquez votre adresse e-mail : nous vous envoyons un lien pour en choisir un nouveau."
      >
        {resetSuccess ? (
          <div className="space-y-6">
            <div className="field-success flex gap-3" role="status">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-ocean-600" aria-hidden="true" />
              <p>
                Si un compte existe avec cette adresse, un lien vient d'être envoyé. Pensez à vérifier vos courriers
                indésirables.
              </p>
            </div>
            <Button type="button" variant="outline" size="lg" fullWidth onClick={backToLogin}>
              Retour à la connexion
            </Button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            {error && (
              <div className="field-error" role="alert">
                {error}
              </div>
            )}

            <AuthField
              id="reset-email"
              name="email"
              type="email"
              label="Adresse e-mail"
              icon={Mail}
              autoComplete="email"
              autoFocus
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="vous@exemple.com"
            />

            <div className="space-y-3">
              <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
                Envoyer le lien
              </Button>
              <Button type="button" variant="ghost" size="lg" fullWidth onClick={backToLogin}>
                Retour à la connexion
              </Button>
            </div>
          </form>
        )}
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Connexion"
      description="Espace réservé à l'équipe MadaBooking : circuits, navettes et réservations."
      footer="Un problème d'accès ? Contactez la personne qui administre le site."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="field-error" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <AuthField
            id="email"
            name="email"
            type="email"
            label="Adresse e-mail"
            icon={Mail}
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
          />

          <PasswordField
            id="password"
            name="password"
            label="Mot de passe"
            icon={Lock}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            labelAside={
              <button
                type="button"
                onClick={() => {
                  setError('')
                  setShowForgotPassword(true)
                }}
                className="rounded text-sm text-ocean-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500"
              >
                Mot de passe oublié ?
              </button>
            }
          />
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
          Se connecter
        </Button>
      </form>
    </AuthLayout>
  )
}
