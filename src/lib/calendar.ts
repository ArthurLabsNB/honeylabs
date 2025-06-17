export function buildEventoICS(titulo: string, inicio: Date, fin: Date): string {
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n)
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${titulo}`,
    `DTSTART:${fmt(inicio)}`,
    `DTEND:${fmt(fin)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
