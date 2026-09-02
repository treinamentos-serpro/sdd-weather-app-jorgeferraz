import { formatForecastDate } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherInfo } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const weather = getWeatherInfo(day.weatherCode);

  return (
    <article className="rounded-lg border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
      <time className="font-semibold text-white" dateTime={day.date}>
        {formatForecastDate(day.date)}
      </time>
      <span aria-hidden="true" className="my-3 block text-4xl">
        {weather.icon}
      </span>
      <p className="text-sm text-white/80">{weather.label}</p>
      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-white/60">Máx.</dt>
          <dd className="font-semibold text-sun">{formatTemperature(day.temperatureMaxC, unit)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-white/60">Mín.</dt>
          <dd className="font-semibold text-white">
            {formatTemperature(day.temperatureMinC, unit)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-white/60">Chuva</dt>
          <dd className="font-semibold text-white">
            {day.precipitationProbability === null
              ? 'Indisponível'
              : `${day.precipitationProbability}%`}
          </dd>
        </div>
      </dl>
    </article>
  );
}
