import { Droplets, Thermometer, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWeather } from '../hooks/useWeather';
import { WeatherIcon } from './ui/WeatherIcon';
import { Skeleton } from './ui/Skeleton';

interface WeatherWidgetProps {
  variant?: 'full' | 'compact';
}

export default function WeatherWidget({ variant = 'full' }: WeatherWidgetProps) {
  const { weather, loading, error } = useWeather();
  const { t } = useTranslation();

  if (variant === 'compact') {
    if (loading) {
      return (
        <span className="inline-flex items-center gap-2 text-sand-100/70 text-sm">
          <Skeleton className="w-4 h-4 rounded bg-sand-50/20" />
          <Skeleton className="h-3 w-16 bg-sand-50/20" />
        </span>
      );
    }

    if (error && !weather) return null;

    return (
      <span className="inline-flex items-center gap-2 text-sm text-sand-100/80">
        {weather && <WeatherIcon iconCode={weather.current.icon} className="w-4 h-4 shrink-0" />}
        <span className="tabular-nums">{weather?.current.temperature}°</span>
        <span className="hidden sm:inline text-sand-100/50">·</span>
        <span className="hidden sm:inline capitalize text-sand-100/70">
          {weather?.current.description}
        </span>
      </span>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-sand-50/20 bg-ocean-800/40 backdrop-blur-sm p-5">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-10 h-10 rounded-lg bg-sand-50/20" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-16 bg-sand-50/20" />
            <Skeleton className="h-3 w-24 bg-sand-50/20" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg bg-sand-50/10" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="rounded-xl border border-sand-50/20 bg-ocean-800/40 backdrop-blur-sm p-5 text-sand-100">
        <p className="text-sm opacity-80">{t('weather.unavailable')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-sand-50/20 bg-ocean-800/40 backdrop-blur-sm p-5 text-sand-50">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-ocean-200 mb-4">
        {t('weather.forecastTitle')}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-5 pb-5 border-b border-sand-50/10">
        {weather && <WeatherIcon iconCode={weather.current.icon} className="w-8 h-8 shrink-0" />}
        <div>
          <div className="font-display text-3xl font-semibold">{weather?.current.temperature}°</div>
          <div className="text-sm text-sand-100/70 capitalize">{weather?.current.description}</div>
        </div>
        <div className="sm:ml-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-sand-100/60">
          {weather?.current.feelsLike && (
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              {weather.current.feelsLike}°
            </div>
          )}
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            {weather?.current.humidity}%
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            {weather?.current.windSpeed} km/h
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {weather?.forecast.map((day, index) => (
          <div key={index} className="rounded-lg bg-sand-50/5 p-3 text-center">
            <div className="text-xs text-sand-100/70 mb-1">{day.date}</div>
            <WeatherIcon iconCode={day.icon} className="w-5 h-5 mx-auto mb-1" />
            <div className="text-sm font-semibold">{day.temperature}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}
