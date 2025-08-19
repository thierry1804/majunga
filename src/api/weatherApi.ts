// Service API pour OpenWeatherMap
const API_KEY = 'e94faa4685cda7d067809c3f0101e91e';
const MAJUNGA_COORDS = {
  lat: import.meta.env.VITE_MAJUNGA_LAT || -15.7167,
  lon: import.meta.env.VITE_MAJUNGA_LON || 46.3167
};

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike?: number;
  pressure?: number;
  visibility?: number;
  date?: string;
  dayName?: string;
}

export interface ForecastData {
  current: WeatherData;
  forecast: WeatherData[];
}

export interface WeatherError {
  message: string;
  code?: string;
}

class WeatherApiService {
  private async makeRequest(url: string): Promise<any> {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Messages d'erreur plus clairs
      if (response.status === 401) {
        throw new Error('Clé API invalide. Vérifiez votre clé OpenWeatherMap dans le fichier .env');
      } else if (response.status === 429) {
        throw new Error('Limite d\'API dépassée. Réessayez plus tard');
      } else if (response.status === 404) {
        throw new Error('Données météo non trouvées pour cette localisation');
      } else {
        throw new Error(errorData.message || `Erreur API: ${response.status} - ${response.statusText}`);
      }
    }
    
    return response.json();
  }

  // API alternative gratuite (OpenMeteo)
  private async getAlternativeWeather(): Promise<any> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${MAJUNGA_COORDS.lat}&longitude=${MAJUNGA_COORDS.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur API alternative');
      }
      
      return response.json();
    } catch (error) {
      throw new Error('Impossible de récupérer les données météo');
    }
  }

  private convertWeatherCode(code: number): { description: string; icon: string } {
    // Conversion des codes météo OpenMeteo vers OpenWeatherMap
    const weatherMap: { [key: number]: { description: string; icon: string } } = {
      0: { description: 'Ciel dégagé', icon: '01d' },
      1: { description: 'Peu nuageux', icon: '02d' },
      2: { description: 'Partiellement nuageux', icon: '02d' },
      3: { description: 'Couvert', icon: '03d' },
      45: { description: 'Brouillard', icon: '50d' },
      48: { description: 'Brouillard givrant', icon: '50d' },
      51: { description: 'Bruine légère', icon: '09d' },
      53: { description: 'Bruine modérée', icon: '09d' },
      55: { description: 'Bruine dense', icon: '09d' },
      61: { description: 'Pluie légère', icon: '10d' },
      63: { description: 'Pluie modérée', icon: '10d' },
      65: { description: 'Pluie forte', icon: '10d' },
      71: { description: 'Neige légère', icon: '13d' },
      73: { description: 'Neige modérée', icon: '13d' },
      75: { description: 'Neige forte', icon: '13d' },
      95: { description: 'Orage', icon: '11d' },
    };
    
    return weatherMap[code] || { description: 'Inconnu', icon: '01d' };
  }

  async getCurrentWeather(): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${MAJUNGA_COORDS.lat}&lon=${MAJUNGA_COORDS.lon}&appid=${API_KEY}&units=metric&lang=fr`;
    return this.makeRequest(url);
  }

  async getForecast(): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${MAJUNGA_COORDS.lat}&lon=${MAJUNGA_COORDS.lon}&appid=${API_KEY}&units=metric&lang=fr`;
    return this.makeRequest(url);
  }

  private getDayName(date: Date): string {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[date.getDay()];
  }

  async getWeatherData(): Promise<ForecastData> {
    try {
      // Essayer d'abord l'API OpenWeatherMap
      const [currentData, forecastData] = await Promise.all([
        this.getCurrentWeather(),
        this.getForecast()
      ]);

      // Traitement des prévisions - prendre les données de midi pour chaque jour
      const today = new Date();
      const dailyForecasts: any[] = [];
      
      // Parcourir aujourd'hui et les 3 prochains jours (4 jours au total)
      for (let i = 0; i <= 3; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        targetDate.setHours(12, 0, 0, 0); // Midi
        
        // Trouver la prévision la plus proche de midi pour ce jour
        const dayForecasts = forecastData.list.filter((item: any) => {
          const itemDate = new Date(item.dt * 1000);
          return itemDate.getDate() === targetDate.getDate() && 
                 itemDate.getMonth() === targetDate.getMonth() &&
                 itemDate.getFullYear() === targetDate.getFullYear();
        });
        
        if (dayForecasts.length > 0) {
          // Prendre la prévision de midi ou la plus proche
          const noonForecast = dayForecasts.find((item: any) => {
            const itemDate = new Date(item.dt * 1000);
            return itemDate.getHours() === 12;
          }) || dayForecasts[Math.floor(dayForecasts.length / 2)];
          
          dailyForecasts.push(noonForecast);
        }
      }

      return {
        current: {
          temperature: Math.round(currentData.main.temp),
          description: currentData.weather[0].description,
          icon: currentData.weather[0].icon,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6), // Conversion m/s vers km/h
          feelsLike: Math.round(currentData.main.feels_like),
          pressure: currentData.main.pressure,
          visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : undefined
        },
        forecast: dailyForecasts.map((item: any) => {
          const date = new Date(item.dt * 1000);
          const isToday = date.getDate() === today.getDate() && 
                         date.getMonth() === today.getMonth() && 
                         date.getFullYear() === today.getFullYear();
          
          return {
            temperature: Math.round(item.main.temp),
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6),
            feelsLike: Math.round(item.main.feels_like),
            date: isToday ? 'Aujourd\'hui' : `${this.getDayName(date)} ${date.getDate()}`,
            dayName: isToday ? 'Aujourd\'hui' : this.getDayName(date)
          };
        })
      };
    } catch (error) {
      console.log('Tentative avec l\'API alternative...');
      
      // En cas d'échec, utiliser l'API alternative
      try {
        const alternativeData = await this.getAlternativeWeather();
        const today = new Date();
        
        // Traitement des données alternatives
        const current = {
          temperature: Math.round(alternativeData.current.temperature_2m),
          description: this.convertWeatherCode(alternativeData.current.weather_code).description,
          icon: this.convertWeatherCode(alternativeData.current.weather_code).icon,
          humidity: alternativeData.current.relative_humidity_2m,
          windSpeed: Math.round(alternativeData.current.wind_speed_10m * 3.6), // Conversion m/s vers km/h
          feelsLike: Math.round(alternativeData.current.apparent_temperature)
        };

        // Prévisions sur 4 jours
        const forecast: any[] = [];
        for (let i = 0; i <= 3; i++) {
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() + i);
          targetDate.setHours(12, 0, 0, 0);
          
          // Trouver l'index correspondant dans les données horaires
          const targetTime = targetDate.toISOString().slice(0, 13) + ':00';
          const timeIndex = alternativeData.hourly.time.indexOf(targetTime);
          
          if (timeIndex !== -1) {
            const isToday = i === 0;
            forecast.push({
              temperature: Math.round(alternativeData.hourly.temperature_2m[timeIndex]),
              description: this.convertWeatherCode(alternativeData.hourly.weather_code[timeIndex]).description,
              icon: this.convertWeatherCode(alternativeData.hourly.weather_code[timeIndex]).icon,
              humidity: alternativeData.hourly.relative_humidity_2m[timeIndex],
              windSpeed: Math.round(alternativeData.hourly.wind_speed_10m[timeIndex] * 3.6),
              feelsLike: Math.round(alternativeData.hourly.apparent_temperature[timeIndex]),
              date: isToday ? 'Aujourd\'hui' : `${this.getDayName(targetDate)} ${targetDate.getDate()}`,
              dayName: isToday ? 'Aujourd\'hui' : this.getDayName(targetDate)
            });
          }
        }

        return { current, forecast };
      } catch (alternativeError) {
        console.error('Erreur avec l\'API alternative:', alternativeError);
        throw error; // Relancer l'erreur originale
      }
    }
  }

  getFallbackData(): ForecastData {
    const today = new Date();
    const getDayName = (date: Date) => {
      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      return days[date.getDay()];
    };

    return {
      current: {
        temperature: 28,
        description: 'Ensoleillé',
        icon: '01d',
        humidity: 65,
        windSpeed: 12,
        feelsLike: 30,
        pressure: 1013,
        visibility: 10
      },
      forecast: [
        {
          temperature: 28,
          description: 'Ensoleillé',
          icon: '01d',
          humidity: 65,
          windSpeed: 12,
          feelsLike: 30,
          date: 'Aujourd\'hui',
          dayName: 'Aujourd\'hui'
        },
        {
          temperature: 29,
          description: 'Ensoleillé',
          icon: '01d',
          humidity: 60,
          windSpeed: 10,
          feelsLike: 31,
          date: `${getDayName(new Date(today.getTime() + 24 * 60 * 60 * 1000))} ${new Date(today.getTime() + 24 * 60 * 60 * 1000).getDate()}`,
          dayName: getDayName(new Date(today.getTime() + 24 * 60 * 60 * 1000))
        },
        {
          temperature: 27,
          description: 'Nuageux',
          icon: '02d',
          humidity: 70,
          windSpeed: 15,
          feelsLike: 29,
          date: `${getDayName(new Date(today.getTime() + 48 * 60 * 60 * 1000))} ${new Date(today.getTime() + 48 * 60 * 60 * 1000).getDate()}`,
          dayName: getDayName(new Date(today.getTime() + 48 * 60 * 60 * 1000))
        },
        {
          temperature: 26,
          description: 'Pluie',
          icon: '10d',
          humidity: 80,
          windSpeed: 20,
          feelsLike: 28,
          date: `${getDayName(new Date(today.getTime() + 72 * 60 * 60 * 1000))} ${new Date(today.getTime() + 72 * 60 * 60 * 1000).getDate()}`,
          dayName: getDayName(new Date(today.getTime() + 72 * 60 * 60 * 1000))
        }
      ]
    };
  }
}

export const weatherApi = new WeatherApiService();
