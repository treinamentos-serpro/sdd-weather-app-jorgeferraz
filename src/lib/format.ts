export function formatForecastDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, (month ?? 1) - 1, day));

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(utcDate);
}
