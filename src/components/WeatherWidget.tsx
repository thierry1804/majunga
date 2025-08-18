import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  date?: string;
}

interface ForecastData {
  current: WeatherData;
  forecast: WeatherData[];
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Coordonnées de Majunga, Madagascar
  const MAJUNGA_COORDS = { lat: -15.7167, lon: 46.3167 };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Utilisation de l'API OpenWeatherMap pour météo actuelle et prévisions
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${MAJUNGA_COORDS.lat}&lon=${MAJUNGA_COORDS.lon}&appid=YOUR_API_KEY&units=metric&lang=fr`
        );
        
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${MAJUNGA_COORDS.lat}&lon=${MAJUNGA_COORDS.lon}&appid=YOUR_API_KEY&units=metric&lang=fr`
        );
        
        if (!currentResponse.ok || !forecastResponse.ok) {
          throw new Error('Impossible de récupérer la météo');
        }
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        
        // Traitement des prévisions (prendre un point par jour)
        const dailyForecasts = forecastData.list.filter((item: any, index: number) => index % 8 === 0).slice(1, 4);
        
        setWeather({
          current: {
            temperature: Math.round(currentData.main.temp),
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind.speed * 3.6)
          },
          forecast: dailyForecasts.map((item: any) => ({
            temperature: Math.round(item.main.temp),
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6),
            date: new Date(item.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
          }))
        });
      } catch (err) {
        setError('Météo non disponible');
        // Données de fallback pour la démo
        setWeather({
          current: {
            temperature: 28,
            description: 'Ensoleillé',
            icon: '01d',
            humidity: 65,
            windSpeed: 12
          },
          forecast: [
            {
              temperature: 29,
              description: 'Ensoleillé',
              icon: '01d',
              humidity: 60,
              windSpeed: 10,
              date: 'Lun 15'
            },
            {
              temperature: 27,
              description: 'Nuageux',
              icon: '02d',
              humidity: 70,
              windSpeed: 15,
              date: 'Mar 16'
            },
            {
              temperature: 26,
              description: 'Pluie',
              icon: '10d',
              humidity: 80,
              windSpeed: 20,
              date: 'Mer 17'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <Sun className="w-5 h-5 text-yellow-400" />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <Cloud className="w-5 h-5 text-gray-400" />;
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (iconCode.includes('11')) return <CloudRain className="w-5 h-5 text-purple-400" />;
    if (iconCode.includes('13')) return <CloudSnow className="w-5 h-5 text-blue-200" />;
    if (iconCode.includes('50')) return <Wind className="w-5 h-5 text-gray-300" />;
    return <Sun className="w-5 h-5 text-yellow-400" />;
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 animate-pulse">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-white/20 rounded"></div>
            <div className="space-y-1">
              <div className="w-12 h-4 bg-white/20 rounded"></div>
              <div className="w-16 h-3 bg-white/20 rounded"></div>
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-1">
              <div className="w-8 h-3 bg-white/20 rounded"></div>
              <div className="w-5 h-5 bg-white/20 rounded"></div>
              <div className="w-10 h-3 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 text-white">
      <div className="flex items-center justify-center space-x-6">
        {/* Météo actuelle */}
        <div className="flex items-center space-x-3">
          {weather && getWeatherIcon(weather.current.icon)}
          <div>
            <div className="text-xl font-bold">{weather?.current.temperature}°C</div>
            <div className="text-xs opacity-90 capitalize">{weather?.current.description}</div>
          </div>
        </div>
        
        {/* Prévisions sur 3 jours */}
        {weather?.forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center space-y-1">
            <div className="text-xs opacity-75">{day.date}</div>
            {getWeatherIcon(day.icon)}
            <div className="text-sm font-medium">{day.temperature}°C</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
