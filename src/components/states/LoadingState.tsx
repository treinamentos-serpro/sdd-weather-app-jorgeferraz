interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({ label = 'Carregando...' }: LoadingStateProps) {
  return (
    <div
      aria-live="polite"
      className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-white backdrop-blur-md"
      role="status"
    >
      {label}
    </div>
  );
}