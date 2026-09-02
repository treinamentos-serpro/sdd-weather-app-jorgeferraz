import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

const units: Array<{ label: string; value: Unit }> = [
  { label: '°C', value: 'celsius' },
  { label: '°F', value: 'fahrenheit' },
];

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div aria-label="Unidade de temperatura" className="flex gap-1" role="group">
      {units.map(({ label, value }) => {
        const isActive = unit === value;

        return (
          <button
            aria-pressed={isActive}
            className={`min-w-12 rounded-md px-3 py-2 font-semibold outline-none transition-colors focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 ${
              isActive
                ? 'bg-accent-500 text-white'
                : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
            }`}
            key={value}
            onClick={() => onChange(value)}
            type="button"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}