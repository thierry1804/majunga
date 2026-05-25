import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';

interface WeatherIconProps {
  iconCode: string;
  className?: string;
}

export const WeatherIcon = ({ iconCode, className = 'w-5 h-5' }: WeatherIconProps) => {
  const getIcon = () => {
    if (iconCode.includes('01')) return <Sun className={`${className} text-terracotta-400`} />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) {
      return <Cloud className={`${className} text-sand-100/70`} />;
    }
    if (iconCode.includes('09') || iconCode.includes('10')) {
      return <CloudRain className={`${className} text-ocean-200`} />;
    }
    if (iconCode.includes('11')) return <CloudRain className={`${className} text-ocean-100`} />;
    if (iconCode.includes('13')) return <CloudSnow className={`${className} text-sand-50`} />;
    if (iconCode.includes('50')) return <Wind className={`${className} text-sand-100/60`} />;
    return <Sun className={`${className} text-terracotta-400`} />;
  };

  return getIcon();
};
