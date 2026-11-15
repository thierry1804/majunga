import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'
import AuthLayout from './AuthLayout'
import { PasswordField } from './AuthField'

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
      setError("Ce lien est incomplet : ouvrez-le depuis l'e-mail reçu, ou demandez un nouveau lien depuis la page de connexion.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne sont pas identiques.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
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
      setError("Une erreur inattendue s'est produite. Réessayez dans un instant.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Nouveau mot de passe"
      description="Choisissez un mot de passe d'au moins 6 caractères. Vous serez ensuite connecté."
    >
      {success ? (
        <div className="field-success flex gap-3" role="status">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-ocean-600" aria-hidden="true" />
          <p>Votre mot de passe est mis à jour. Redirection vers l'espace équipe…</p>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="field-error" role="alert">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <PasswordField
              id="password"
              name="password"
              label="Nouveau mot de passe"
              icon={Lock}
              autoComplete="new-password"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
            />
            <PasswordField
              id="confirm-password"
              name="confirm-password"
              label="Confirmer le mot de passe"
              icon={Lock}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
            Mettre à jour le mot de passe
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
