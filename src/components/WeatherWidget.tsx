import { Droplets, Thermometer, Wind } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { WeatherIcon } from './ui/WeatherIcon';

const WeatherWidget = () => {
  const { weather, loading, error } = useWeather();

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
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 text-white">
        <div className="text-center">
          <div className="text-sm opacity-75">Météo non disponible</div>
          {error && (
            <div className="text-xs opacity-50 mt-1">
              {error.includes('Clé API') ? 'Configurez votre clé API dans .env' : error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 text-white">
      <div className="flex items-center justify-center space-x-6">
        {/* Météo actuelle */}
        <div className="flex items-center space-x-3">
          {weather && <WeatherIcon iconCode={weather.current.icon} className="w-6 h-6" />}
          <div>
            <div className="text-xl font-bold">{weather?.current.temperature}°C</div>
            <div className="text-xs opacity-90 capitalize">{weather?.current.description}</div>
            {weather?.current.feelsLike && (
              <div className="text-xs opacity-75 flex items-center gap-1">
                <Thermometer className="w-3 h-3" />
                Ressenti: {weather.current.feelsLike}°C
              </div>
            )}
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="flex flex-col space-y-1 text-xs opacity-75">
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            {weather?.current.humidity}%
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            {weather?.current.windSpeed} km/h
          </div>
        </div>
        
        {/* Prévisions sur 3 jours - Améliorées */}
        <div className="flex space-x-4">
          {weather?.forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 bg-white/5 rounded-lg p-2 min-w-[60px]">
              <div className="text-xs font-medium opacity-90">{day.date}</div>
              <WeatherIcon iconCode={day.icon} className="w-6 h-6" />
              <div className="text-sm font-bold">{day.temperature}°C</div>
              <div className="text-xs opacity-75 text-center capitalize">
                {day.description}
              </div>
              <div className="flex flex-col space-y-1 text-xs opacity-60">
                <div className="flex items-center gap-1">
                  <Droplets className="w-2 h-2" />
                  {day.humidity}%
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-2 h-2" />
                  {day.windSpeed} km/h
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
