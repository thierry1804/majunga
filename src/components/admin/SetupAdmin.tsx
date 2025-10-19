import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { Shield, CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function SetupAdmin() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [existingProfile, setExistingProfile] = useState<any>(null)

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data && !error) {
          setExistingProfile(data)
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du profil:', err)
      }
    }

    checkProfile()
  }, [user])

  const handleCreateAdminProfile = async () => {
    if (!user) {
      setError('Aucun utilisateur connecté')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Vérifier si le profil existe déjà
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (existing) {
        // Mettre à jour le profil existant
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            role: 'admin',
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) {
          throw updateError
        }

        setSuccess(true)
        setExistingProfile({ ...existing, role: 'admin' })
      } else {
        // Créer un nouveau profil
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || null,
            role: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          throw insertError
        }

        setSuccess(true)
        setExistingProfile({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name,
          role: 'admin'
        })
      }

      // Attendre 2 secondes puis recharger la page
      setTimeout(() => {
        window.location.href = '/admin'
      }, 2000)
    } catch (err: any) {
      console.error('Erreur lors de la création du profil admin:', err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Connexion requise
          </h2>
          <p className="mt-2 text-gray-600">
            Vous devez être connecté pour configurer un compte administrateur.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Configuration Administrateur
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Configurez votre compte comme administrateur
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Informations de connexion
              </h3>
              <dl className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Email:</dt>
                  <dd className="text-sm text-gray-900">{user.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">ID:</dt>
                  <dd className="text-sm text-gray-900 font-mono text-xs">
                    {user.id.substring(0, 8)}...
                  </dd>
                </div>
                {existingProfile && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Rôle actuel:</dt>
                    <dd className="text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        existingProfile.role === 'admin' ? 'bg-green-100 text-green-800' :
                        existingProfile.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {existingProfile.role}
                      </span>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Succès</h3>
                    <div className="mt-2 text-sm text-green-700">
                      Votre compte a été configuré comme administrateur. Redirection en cours...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {existingProfile?.role === 'admin' ? (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Votre compte est déjà configuré comme administrateur.
                    </p>
                    <a
                      href="/admin"
                      className="mt-2 inline-block text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      Accéder au panneau d'administration →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleCreateAdminProfile}
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Configuration en cours...
                  </>
                ) : (
                  <>
                    <Shield className="-ml-1 mr-2 h-4 w-4" />
                    {existingProfile ? 'Promouvoir en Admin' : 'Créer le profil Admin'}
                  </>
                )}
              </button>
            )}

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500">
                Cette page permet de créer ou mettre à jour votre profil avec les droits d'administrateur.
                Après la configuration, vous aurez accès à toutes les fonctionnalités d'administration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
