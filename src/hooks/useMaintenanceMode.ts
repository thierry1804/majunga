import { useState, useEffect } from 'react';
import { getSiteSettingByKey } from '../api/madabookingApi';

export function useMaintenanceMode() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer le paramètre maintenance_mode
        const maintenanceSetting = await getSiteSettingByKey('maintenance_mode');
        const isActive = maintenanceSetting?.value === 'true' || maintenanceSetting?.value === '1';
        setIsMaintenanceMode(isActive);

        // Récupérer le message de maintenance si disponible
        const messageSetting = await getSiteSettingByKey('maintenance_message');
        setMaintenanceMessage(messageSetting?.value || null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erreur lors de la vérification du mode maintenance');
        setError(error);
        console.error('Erreur lors de la vérification du mode maintenance:', err);
        // En cas d'erreur, on considère que le site n'est pas en maintenance
        setIsMaintenanceMode(false);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenanceMode();

    // Vérifier périodiquement (toutes les 30 secondes)
    const interval = setInterval(checkMaintenanceMode, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    isMaintenanceMode,
    loading,
    error,
    maintenanceMessage,
  };
}

