import { useEffect, useState } from 'react';

import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import weatherData from './fixtures/weatherData';
import type { Unit } from './types/weather';

type AppStatus = 'idle' | 'loading' | 'empty' | 'error' | 'success';

export default function App() {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [unit, setUnit] = useState<Unit>('celsius');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status !== 'loading') {
      return;
    }

    const normalizedSearch = searchTerm.toLocaleLowerCase('pt-BR');
    if (normalizedSearch === 'vazio') {
      setStatus('empty');
      return;
    }
    if (normalizedSearch === 'erro') {
      setStatus('error');
      return;
    }

    setStatus('success');
  }, [searchTerm, status]);

  function handleSearch(city: string) {
    setSearchTerm(city);
    setStatus('loading');
  }

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-800/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <h1 className="text-2xl font-bold text-sun">Tempo Agora</h1>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
            <SearchBar disabled={status === 'loading'} onSearch={handleSearch} />
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
            message="Não foi possível consultar a previsão. Tente novamente em instantes."
            onRetry={() => setStatus('loading')}
          />
        ) : null}
        {status === 'success' ? (
          <>
            <CurrentWeather city={weatherData.city} current={weatherData.current} unit={unit} />
            <ForecastList forecast={weatherData.forecast} unit={unit} />
          </>
        ) : null}
      </main>
    </div>
  );
}
