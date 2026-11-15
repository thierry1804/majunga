import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoginForm from './LoginForm'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Déjà connecté : inutile d'afficher le formulaire
  if (user) {
    return <Navigate to="/" replace />
  }

  return <LoginForm onSuccess={() => navigate('/')} />
}
