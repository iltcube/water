import type { DateKey } from '@/shared/lib/date';

export interface WaterIntakeEntry {
  id: string;
  amountMl: number;
  createdAt: string;
}

export interface WaterDay {
  dateKey: DateKey;
  targetMl: number;
  entries: WaterIntakeEntry[];
}

export interface WaterDaySummary {
  dateKey: DateKey;
  targetMl: number;
  consumedMl: number;
  progressRatio: number;
  isCompleted: boolean;
}
