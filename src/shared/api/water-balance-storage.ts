import { useLocalStorage } from '@vueuse/core';
import type { Ref } from 'vue';
import type { UserProfile } from '@/entities/profile/model/types';
import type { WaterDay } from '@/entities/water-day/model/types';

export interface WaterBalanceState {
  profile: UserProfile | null;
  days: Record<string, WaterDay>;
}

const initialState: WaterBalanceState = {
  profile: null,
  days: {}
};

export const useWaterBalanceStorage = (): Ref<WaterBalanceState> =>
  useLocalStorage<WaterBalanceState>('water-balance:v1', initialState, {
    mergeDefaults: true,
    writeDefaults: true
  });
