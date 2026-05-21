<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { ProfileDraft, UserProfile } from '@/entities/profile/model/types';

const props = defineProps<{
  profile: UserProfile | null;
}>();

const emit = defineEmits<{
  save: [draft: ProfileDraft];
}>();

const form = reactive<ProfileDraft>({
  name: '',
  weightKg: 70,
  activityLevel: 'moderate',
  gender: 'not_specified',
  portionMl: 500
});

watch(
  () => props.profile,
  (profile) => {
    if (!profile) return;

    form.name = profile.name;
    form.weightKg = profile.weightKg;
    form.activityLevel = profile.activityLevel;
    form.gender = profile.gender;
    form.portionMl = profile.portionMl;
  },
  { immediate: true }
);

const submit = (): void => {
  emit('save', { ...form });
};
</script>

<template>
  <form class="card profile-form" @submit.prevent="submit">
    <div>
      <p class="eyebrow">Профиль</p>
      <h2>{{ profile ? 'Обновить параметры' : 'Расскажите о себе' }}</h2>
      <p class="muted">Данные нужны только для локального расчёта дневной нормы воды.</p>
    </div>

    <label>
      <span>Имя</span>
      <input v-model.trim="form.name" required placeholder="Например, Алексей" autocomplete="given-name" />
    </label>

    <div class="field-grid">
      <label>
        <span>Вес, кг</span>
        <input v-model.number="form.weightKg" required min="30" max="250" type="number" inputmode="decimal" />
      </label>

      <label>
        <span>Порция, мл</span>
        <input v-model.number="form.portionMl" required min="50" max="2000" step="50" type="number" inputmode="numeric" />
      </label>
    </div>

    <label>
      <span>Активность</span>
      <select v-model="form.activityLevel">
        <option value="low">Низкая</option>
        <option value="moderate">Средняя</option>
        <option value="high">Высокая</option>
      </select>
    </label>

    <label>
      <span>Пол</span>
      <select v-model="form.gender">
        <option value="not_specified">Не указывать</option>
        <option value="female">Женский</option>
        <option value="male">Мужской</option>
      </select>
    </label>

    <button class="primary-button" type="submit">{{ profile ? 'Сохранить изменения' : 'Начать отслеживание' }}</button>
  </form>
</template>
