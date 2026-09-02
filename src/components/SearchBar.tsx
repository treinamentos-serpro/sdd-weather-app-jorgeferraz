import { useState, type FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const searchTerm = city.trim();
    if (searchTerm) {
      onSearch(searchTerm);
    }
  }

  return (
    <form
      className="flex w-full max-w-xl gap-2 rounded-lg border border-white/10 bg-white/5 p-2 backdrop-blur-md"
      onSubmit={handleSubmit}
      role="search"
    >
      <label className="sr-only" htmlFor="city-search">
        Pesquisar cidade
      </label>
      <input
        className="min-w-0 flex-1 rounded-md border border-transparent bg-night-800 px-3 py-2 text-white outline-none placeholder:text-white/50 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        id="city-search"
        onChange={(event) => setCity(event.target.value)}
        placeholder="Pesquisar cidade"
        type="search"
        value={city}
      />
      <button
        className="rounded-md bg-accent-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        type="submit"
      >
        Buscar
      </button>
    </form>
  );
}