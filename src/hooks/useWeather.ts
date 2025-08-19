import { useState, useEffect } from 'react';
import { weatherApi, ForecastData } from '../api/weatherApi';

interface UseWeatherReturn {
  weather: ForecastData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const weatherData = await weatherApi.getWeatherData();
      setWeather(weatherData);
    } catch (err) {
      console.error('Erreur météo:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      
      // Utiliser les données de fallback
      setWeather(weatherApi.getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather
  };
};
