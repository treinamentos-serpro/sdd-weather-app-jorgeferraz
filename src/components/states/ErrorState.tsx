interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="rounded-lg border border-red-300/30 bg-red-500/10 p-8 text-center text-white backdrop-blur-md"
      role="alert"
    >
      <h2 className="text-xl font-semibold">Não foi possível carregar o clima</h2>
      <p className="mt-2 text-white/80">{message}</p>
      {onRetry ? (
        <button
          className="mt-5 rounded-md bg-accent-500 px-4 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900"
          onClick={onRetry}
          type="button"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
