import { useState, useEffect, useCallback } from 'react';
import {
  getSiteSettings,
  getPublicSiteSettings,
  getSiteSettingByKey,
  createSiteSetting,
  updateSiteSetting,
  patchSiteSetting,
  deleteSiteSetting,
  ApiSiteSetting,
} from '../api/madabookingApi';

interface UseSiteSettingsOptions {
  publicOnly?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useSiteSettings(options: UseSiteSettingsOptions = {}) {
  const { publicOnly = false, autoRefresh = false, refreshInterval = 60000 } = options;
  const [settings, setSettings] = useState<ApiSiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = publicOnly ? await getPublicSiteSettings() : await getSiteSettings();
      setSettings(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur lors du chargement des paramètres');
      setError(error);
      console.error('Erreur lors du chargement des paramètres:', err);
    } finally {
      setLoading(false);
    }
  }, [publicOnly]);

  useEffect(() => {
    fetchSettings();

    if (autoRefresh) {
      const interval = setInterval(fetchSettings, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchSettings, autoRefresh, refreshInterval]);

  const getSetting = useCallback((key: string): ApiSiteSetting | undefined => {
    return settings.find(s => s.key === key);
  }, [settings]);

  const getSettingValue = useCallback((key: string): string | null => {
    const setting = getSetting(key);
    return setting?.value ?? null;
  }, [getSetting]);

  const getSettingBoolean = useCallback((key: string): boolean => {
    const value = getSettingValue(key);
    return value === 'true' || value === '1';
  }, [getSettingValue]);

  const getSettingNumber = useCallback((key: string): number | null => {
    const value = getSettingValue(key);
    if (value === null) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }, [getSettingValue]);

  const updateSetting = useCallback(async (id: string, setting: Partial<ApiSiteSetting>): Promise<void> => {
    try {
      await patchSiteSetting(id, setting);
      await fetchSettings();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur lors de la mise à jour du paramètre');
      setError(error);
      throw error;
    }
  }, [fetchSettings]);

  const updateSettingByKey = useCallback(async (key: string, value: string): Promise<void> => {
    try {
      const existing = getSetting(key);
      if (!existing || !existing.id) {
        throw new Error(`Le paramètre avec la clé "${key}" n'existe pas`);
      }
      await patchSiteSetting(existing.id, { value });
      await fetchSettings();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur lors de la mise à jour du paramètre');
      setError(error);
      throw error;
    }
  }, [getSetting, fetchSettings]);

  const createSetting = useCallback(async (setting: Omit<ApiSiteSetting, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      await createSiteSetting(setting);
      await fetchSettings();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur lors de la création du paramètre');
      setError(error);
      throw error;
    }
  }, [fetchSettings]);

  const removeSetting = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteSiteSetting(id);
      await fetchSettings();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur lors de la suppression du paramètre');
      setError(error);
      throw error;
    }
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refresh: fetchSettings,
    getSetting,
    getSettingValue,
    getSettingBoolean,
    getSettingNumber,
    updateSetting,
    updateSettingByKey,
    createSetting,
    removeSetting,
  };
}

