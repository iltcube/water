import type { ActivityLevel, UserProfile } from './types';

const activityMultiplier: Record<ActivityLevel, number> = {
  low: 30,
  moderate: 35,
  high: 40
};

export const calculateDailyWaterTargetMl = (profile: Pick<UserProfile, 'weightKg' | 'activityLevel'>): number => {
  const target = profile.weightKg * activityMultiplier[profile.activityLevel];
  return Math.round(target / 50) * 50;
};

export const calculatePortionsPerDay = (targetMl: number, portionMl: number): number => Math.ceil(targetMl / portionMl);
