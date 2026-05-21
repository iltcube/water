export type DateKey = `${number}-${number}-${number}`;

const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

export const toDateKey = (date: Date): DateKey => dateKeyFormatter.format(date) as DateKey;

export const todayKey = (): DateKey => toDateKey(new Date());

export const shiftDateKey = (dateKey: DateKey, days: number): DateKey => {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
};

export const formatHumanDate = (dateKey: DateKey): string =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date(`${dateKey}T12:00:00`));

export const getRecentDateKeys = (count: number, from: DateKey = todayKey()): DateKey[] =>
  Array.from({ length: count }, (_, index) => shiftDateKey(from, index - count + 1));
