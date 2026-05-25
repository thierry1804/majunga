import { useState, useEffect } from 'react'
import { 
  login as apiLogin, 
  logout as apiLogout, 
  getCurrentUser, 
  getMe,
  isAuthenticated,
  ApiUser 
} from '../api/madabookingApi'
// Types pour compatibilité
type User = ApiUser
type Session = { user: ApiUser | null } | null

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'editor' | 'user'
  created_at: string
  updated_at: string
}

// Fonction helper pour convertir les rôles de l'API en format attendu
function convertApiRoleToProfileRole(apiRoles?: string[]): 'admin' | 'editor' | 'user' {
  if (!apiRoles || apiRoles.length === 0) {
    return 'user';
  }
  
  // Vérifier les rôles dans l'ordre de priorité
  if (apiRoles.includes('ROLE_ADMIN')) {
    return 'admin';
  }
  if (apiRoles.includes('ROLE_EDITOR')) {
    return 'editor';
  }
  // Par défaut, même si ROLE_USER est présent, on retourne 'user'
  return 'user';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  // Fonction helper pour créer ou récupérer le profil avec timeout
  // DÉSACTIVÉ - Supabase supprimé
  const fetchOrCreateProfile = async (user: User): Promise<Profile | null> => {
    console.warn('[useAuth] Supabase supprimé - authentification désactivée')
    return null
  }

  // Fonction pour rafraîchir le profil depuis l'API
  const refreshProfile = async () => {
    try {
      if (isAuthenticated()) {
        const currentUser = await getMe();
        if (currentUser) {
          setUser(currentUser);
          setProfile({
            id: currentUser.id || '',
            email: currentUser.email,
            full_name: null,
            role: convertApiRoleToProfileRole(currentUser.roles),
            created_at: '',
            updated_at: ''
          });
          setSession({ user: currentUser });
        }
      }
    } catch (error) {
      console.error('[useAuth] Erreur lors du rafraîchissement du profil:', error);
      throw error;
    }
  }

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          // Essayer d'abord de récupérer depuis /me pour avoir les rôles à jour
          try {
            const currentUser = await getMe();
            if (currentUser) {
              setUser(currentUser);
              setProfile({
                id: currentUser.id || '',
                email: currentUser.email,
                full_name: null,
                role: convertApiRoleToProfileRole(currentUser.roles),
                created_at: '',
                updated_at: ''
              });
              setSession({ user: currentUser });
            }
          } catch (error) {
            // Fallback: utiliser l'utilisateur stocké
            console.log('[useAuth] Impossible de récupérer via /me, utilisation de l\'utilisateur stocké');
            const currentUser = getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              setProfile({
                id: currentUser.id || '',
                email: currentUser.email,
                full_name: null,
                role: convertApiRoleToProfileRole(currentUser.roles),
                created_at: '',
                updated_at: ''
              });
              setSession({ user: currentUser });
            }
          }
        }
      } catch (error) {
        console.error('[useAuth] Erreur lors de la vérification de l\'authentification:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { user, token } = await apiLogin({ email, password });
      
      setUser(user);
      setProfile({
        id: user.id || '',
        email: user.email,
        full_name: null,
        role: convertApiRoleToProfileRole(user.roles),
        created_at: '',
        updated_at: ''
      });
      setSession({ user });
      
      return { data: { user, session: { user } }, error: null };
    } catch (error: any) {
      console.error('[useAuth] Erreur de connexion:', error);
      return { 
        data: null, 
        error: { 
          message: error.message || 'Email ou mot de passe incorrect' 
        } 
      };
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Pour l'instant, l'API ne supporte que la création d'utilisateur
    // L'inscription peut être gérée via createUser si nécessaire
    console.warn('[useAuth] Inscription non implémentée via API Madabooking');
    return { data: null, error: { message: 'Inscription non disponible' } };
  }

  const signOut = async () => {
    apiLogout();
    setUser(null)
    setProfile(null)
    setSession(null)
    return { error: null }
  }

  const resetPassword = async (email: string) => {
    console.warn('[useAuth] Réinitialisation de mot de passe non implémentée');
    return { data: null, error: { message: 'Réinitialisation de mot de passe non disponible' } };
  }

  const updatePassword = async (newPassword: string) => {
    console.warn('[useAuth] Mise à jour de mot de passe non implémentée');
    return { data: null, error: { message: 'Mise à jour de mot de passe non disponible' } };
  }

  const isAdmin = () => profile?.role === 'admin'
  const isEditor = () => profile?.role === 'editor' || profile?.role === 'admin'
  const canAccessAdmin = () => isAdmin() || isEditor()

  return {
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
    refreshProfile,
  }
}
