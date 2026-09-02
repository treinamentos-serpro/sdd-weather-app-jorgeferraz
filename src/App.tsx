import { useState } from 'react';

import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import useWeather from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const { status, data, error, retry, search } = useWeather();
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-800/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <h1 className="text-2xl font-bold text-sun">Tempo Agora</h1>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
            <SearchBar disabled={status === 'loading'} onSearch={search} />
            <UnitToggle onChange={setUnit} unit={unit} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {status === 'idle' ? <EmptyState /> : null}
        {status === 'loading' ? <LoadingState label="Buscando previsão..." /> : null}
        {status === 'empty' ? (
          <EmptyState
            hint="Revise o nome informado ou tente outra cidade."
            title="Nenhuma cidade encontrada"
          />
        ) : null}
        {status === 'error' ? (
          <ErrorState
            message={
              error ?? 'Não foi possível consultar a previsão. Tente novamente em instantes.'
            }
            onRetry={retry}
          />
        ) : null}
        {status === 'success' && data ? (
          <>
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </>
        ) : null}
      </main>
    </div>
  );
}
