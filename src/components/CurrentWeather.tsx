import { formatTemperature } from '../lib/temperature';
import { getWeatherInfo } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

interface Metric {
  label: string;
  value: number | null;
  unit: string;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const weather = getWeatherInfo(current.weatherCode);
  const metrics: Metric[] = [
    { label: 'Umidade', value: current.humidity, unit: '%' },
    { label: 'Vento', value: current.windSpeed, unit: 'km/h' },
    { label: 'Precipitação', value: current.precipitation, unit: 'mm' },
    { label: 'Pressão', value: current.pressure, unit: 'hPa' },
  ];

  return (
    <section className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-md sm:p-8">
      <p className="text-sm font-medium text-accent-400">Agora em</p>
      <h2 className="mt-1 text-2xl font-semibold text-white">{city.name}</h2>
      <div className="mt-6 flex items-center gap-5">
        <span aria-hidden="true" className="text-6xl">{weather.icon}</span>
        <div>
          <p className="text-6xl font-bold leading-none text-sun sm:text-7xl">
            {formatTemperature(current.temperatureC, unit)}
          </p>
          <p className="mt-2 text-lg text-white/80">{weather.label}</p>
        </div>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div className="rounded-md bg-night-800/70 p-3" key={metric.label}>
            <dt className="text-sm text-white/60">{metric.label}</dt>
            <dd className="mt-1 font-semibold text-white">
              {metric.value === null ? 'Indisponível' : `${metric.value} ${metric.unit}`}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}