import type { DateKey } from '@/shared/lib/date';
import type { WaterDay, WaterDaySummary, WaterIntakeEntry } from './types';

export const createWaterDay = (dateKey: DateKey, targetMl: number): WaterDay => ({
  dateKey,
  targetMl,
  entries: []
});

export const createWaterIntakeEntry = (amountMl: number): WaterIntakeEntry => ({
  id: crypto.randomUUID(),
  amountMl,
  createdAt: new Date().toISOString()
});

export const getConsumedMl = (day: WaterDay): number =>
  day.entries.reduce((total, entry) => total + entry.amountMl, 0);

export const summarizeWaterDay = (day: WaterDay): WaterDaySummary => {
  const consumedMl = getConsumedMl(day);
  const progressRatio = day.targetMl > 0 ? Math.min(consumedMl / day.targetMl, 1) : 0;

  return {
    dateKey: day.dateKey,
    targetMl: day.targetMl,
    consumedMl,
    progressRatio,
    isCompleted: consumedMl >= day.targetMl
  };
};

export const removeLastEntry = (day: WaterDay): WaterDay => ({
  ...day,
  entries: day.entries.slice(0, -1)
});
