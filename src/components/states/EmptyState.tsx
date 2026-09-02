interface EmptyStateProps {
  title?: string;
  hint?: string;
}

export default function EmptyState({
  title = 'Pesquise uma cidade',
  hint = 'Informe o nome de uma cidade para consultar a previsão.',
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-white backdrop-blur-md">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-white/70">{hint}</p>
    </div>
  );
}