interface WeatherInfo {
  label: string;
  icon: string;
}

const weatherCodes: Record<number, WeatherInfo> = {
  0: { label: 'Céu limpo', icon: '☀️' },
  1: { label: 'Predomínio de sol', icon: '🌤️' },
  2: { label: 'Parcialmente nublado', icon: '⛅' },
  3: { label: 'Nublado', icon: '☁️' },
  45: { label: 'Névoa', icon: '🌫️' },
  48: { label: 'Névoa com gelo', icon: '🌫️' },
  51: { label: 'Garoa leve', icon: '🌦️' },
  53: { label: 'Garoa moderada', icon: '🌦️' },
  55: { label: 'Garoa intensa', icon: '🌧️' },
  61: { label: 'Chuva fraca', icon: '🌦️' },
  63: { label: 'Chuva moderada', icon: '🌧️' },
  65: { label: 'Chuva forte', icon: '🌧️' },
  71: { label: 'Neve fraca', icon: '🌨️' },
  73: { label: 'Neve moderada', icon: '🌨️' },
  75: { label: 'Neve forte', icon: '❄️' },
  80: { label: 'Pancadas de chuva', icon: '🌦️' },
  81: { label: 'Pancadas de chuva', icon: '🌧️' },
  82: { label: 'Pancadas de chuva forte', icon: '⛈️' },
  95: { label: 'Trovoadas', icon: '⛈️' },
};

export function getWeatherInfo(weatherCode: number | null): WeatherInfo {
  return weatherCode === null ? { label: 'Indisponível', icon: '—' } :
    (weatherCodes[weatherCode] ?? { label: 'Indisponível', icon: '—' });
}