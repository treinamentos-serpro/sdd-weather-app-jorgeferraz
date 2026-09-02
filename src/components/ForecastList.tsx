import ForecastCard from './ForecastCard';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-title" className="mt-8">
      <h2 className="text-xl font-semibold text-white" id="forecast-title">
        Previsão para os próximos dias
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {forecast.map((day) => (
          <li key={day.date}>
            <ForecastCard day={day} unit={unit} />
          </li>
        ))}
      </ul>
    </section>
  );
}