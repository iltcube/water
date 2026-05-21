export type ActivityLevel = 'low' | 'moderate' | 'high';
export type Gender = 'female' | 'male' | 'not_specified';

export interface UserProfile {
  name: string;
  weightKg: number;
  activityLevel: ActivityLevel;
  gender: Gender;
  portionMl: number;
  updatedAt: string;
}

export interface ProfileDraft {
  name: string;
  weightKg: number;
  activityLevel: ActivityLevel;
  gender: Gender;
  portionMl: number;
}
