import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'editor' | 'user'
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ data: any; error: any }>
  updatePassword: (newPassword: string) => Promise<{ data: any; error: any }>
  isAdmin: () => boolean
  isEditor: () => boolean
  canAccessAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  // Fonction helper pour créer ou récupérer le profil avec timeout
  const fetchOrCreateProfile = async (user: User): Promise<Profile | null> => {
    const timeoutMs = 30000

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout lors de la récupération du profil')), timeoutMs)
      })

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const { data: profileData, error: fetchError } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ])

      if (profileData && !fetchError) {
        console.log('Profil récupéré avec succès')
        return profileData
      }

      if (fetchError?.code === 'PGRST116') {
        console.log('Profil non trouvé, tentative de création...')

        const newProfile = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || null,
          role: 'user'
        }

        const createPromise = supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single()

        const { data: createdProfile, error: createError } = await Promise.race([
          createPromise,
          timeoutPromise
        ])

        if (createdProfile && !createError) {
          console.log('Profil créé avec succès')
          return createdProfile
        } else {
          console.error('Erreur lors de la création du profil:', createError)
          return null
        }
      }

      console.error('Erreur lors de la récupération du profil:', fetchError)
      return null
    } catch (error) {
      if (error instanceof Error && !error.message.includes('Timeout')) {
        console.error('Erreur lors de la récupération/création du profil:', error)
      }
      return null
    }
  }

  useEffect(() => {
    let mounted = true
    let initialLoadComplete = false

    const getSession = async () => {
      try {
        console.log('[AuthContext] Initializing auth check...')

        if (!supabase || !supabase.auth) {
          console.warn('[AuthContext] Supabase non configuré')
          if (mounted) {
            setLoading(false)
          }
          return
        }

        console.log('[AuthContext] Fetching session...')

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout lors de la récupération de la session')), 30000)
        })

        const sessionPromise = supabase.auth.getSession()

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ])

        if (!mounted) {
          console.log('[AuthContext] Component unmounted, aborting')
          return
        }

        if (error) {
          console.error('[AuthContext] Erreur de session:', error)
          if (mounted) {
            setLoading(false)
          }
          return
        }

        console.log('[AuthContext] Session fetched:', session ? 'User logged in' : 'No session')

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          console.log('[AuthContext] Fetching profile for user:', session.user.email)
          const profile = await fetchOrCreateProfile(session.user)
          if (mounted) {
            setProfile(profile)
            console.log('[AuthContext] Profile set:', profile ? `Role: ${profile.role}` : 'No profile')
          }
        } else {
          setProfile(null)
        }

        if (mounted) {
          setLoading(false)
          initialLoadComplete = true
          console.log('[AuthContext] Auth initialization complete')
        }
      } catch (error) {
        if (mounted) {
          if (!(error instanceof Error && error.message.includes('Timeout'))) {
            console.error('[AuthContext] Erreur lors de la récupération de la session:', error)
          }
          setLoading(false)
          initialLoadComplete = true
        }
      }
    }

    getSession()

    if (!supabase || !supabase.auth) {
      console.warn('[AuthContext] Supabase non configuré - pas d\'écoute des changements d\'auth')
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('[AuthContext] Auth state changed:', event, '| Initial load complete:', initialLoadComplete)

        // Ne pas changer loading pendant l'initialisation
        if (!initialLoadComplete) {
          console.log('[AuthContext] Skipping state change during initialization')
          return
        }

        try {
          setSession(session)
          setUser(session?.user ?? null)

          if (session?.user) {
            const profile = await fetchOrCreateProfile(session.user)
            if (mounted) {
              setProfile(profile)
            }
          } else {
            setProfile(null)
          }
        } catch (error) {
          console.error('[AuthContext] Erreur dans onAuthStateChange:', error)
          if (mounted) {
            setProfile(null)
          }
        } finally {
          // Toujours mettre loading à false après avoir traité le changement
          if (mounted) {
            console.log('[AuthContext] Auth state change handled')
          }
        }
      }
    )

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  }

  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { data, error }
  }

  const isAdmin = () => profile?.role === 'admin'
  const isEditor = () => profile?.role === 'editor' || profile?.role === 'admin'
  const canAccessAdmin = () => isAdmin() || isEditor()

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAdmin,
    isEditor,
    canAccessAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
