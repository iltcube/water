import { computed } from 'vue';
import { getRecentDateKeys, todayKey } from '@/shared/lib/date';
import { useWaterBalanceStorage } from '@/shared/api/water-balance-storage';
import { calculateDailyWaterTargetMl, calculatePortionsPerDay } from '@/entities/profile/model/water-target';
import type { ProfileDraft, UserProfile } from '@/entities/profile/model/types';
import { createWaterDay, createWaterIntakeEntry, removeLastEntry, summarizeWaterDay } from '@/entities/water-day/model/water-day';
import type { WaterDay } from '@/entities/water-day/model/types';

const makeProfile = (draft: ProfileDraft): UserProfile => ({
  ...draft,
  updatedAt: new Date().toISOString()
});

export const useWaterBalance = () => {
  const state = useWaterBalanceStorage();
  const today = computed(() => todayKey());
  const profile = computed(() => state.value.profile);
  const hasProfile = computed(() => profile.value !== null);
  const dailyTargetMl = computed(() => (profile.value ? calculateDailyWaterTargetMl(profile.value) : 0));
  const portionsPerDay = computed(() =>
    profile.value ? calculatePortionsPerDay(dailyTargetMl.value, profile.value.portionMl) : 0
  );

  const ensureDay = (dateKey = today.value): WaterDay => {
    const existingDay = state.value.days[dateKey];

    if (existingDay) {
      const shouldRefreshTarget = dateKey === today.value && existingDay.targetMl !== dailyTargetMl.value;
      return shouldRefreshTarget ? { ...existingDay, targetMl: dailyTargetMl.value } : existingDay;
    }

    return createWaterDay(dateKey, dailyTargetMl.value);
  };

  const currentDay = computed(() => ensureDay(today.value));
  const currentSummary = computed(() => summarizeWaterDay(currentDay.value));
  const recentSummaries = computed(() =>
    getRecentDateKeys(21).map((dateKey) => summarizeWaterDay(ensureDay(dateKey)))
  );

  const saveProfile = (draft: ProfileDraft): void => {
    state.value.profile = makeProfile(draft);
    state.value.days[today.value] = ensureDay(today.value);
  };

  const addPortion = (): void => {
    if (!profile.value) return;

    const day = ensureDay(today.value);
    state.value.days[today.value] = {
      ...day,
      entries: [...day.entries, createWaterIntakeEntry(profile.value.portionMl)]
    };
  };

  const undoLastPortion = (): void => {
    const day = ensureDay(today.value);
    state.value.days[today.value] = removeLastEntry(day);
  };

  return {
    state,
    profile,
    hasProfile,
    dailyTargetMl,
    portionsPerDay,
    currentSummary,
    recentSummaries,
    saveProfile,
    addPortion,
    undoLastPortion
  };
};
