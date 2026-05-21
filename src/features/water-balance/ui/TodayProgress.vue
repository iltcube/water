<script setup lang="ts">
import type { WaterDaySummary } from '@/entities/water-day/model/types';

const props = defineProps<{
  summary: WaterDaySummary;
  portionMl: number;
  portionsPerDay: number;
}>();

const emit = defineEmits<{
  drink: [];
  undo: [];
}>();

const liters = (ml: number): string => (ml / 1000).toFixed(1);
</script>

<template>
  <section class="card hero-card">
    <div class="hero-copy">
      <p class="eyebrow">Сегодня</p>
      <h1>{{ liters(summary.consumedMl) }} / {{ liters(summary.targetMl) }} л</h1>
      <p class="muted">
        {{ summary.isCompleted ? 'Норма выполнена. Отличная работа!' : `Осталось ${liters(Math.max(summary.targetMl - summary.consumedMl, 0))} л` }}
      </p>
    </div>

    <div class="water-ring" :style="{ '--progress': `${summary.progressRatio * 100}%` }">
      <div>
        <strong>{{ Math.round(summary.progressRatio * 100) }}%</strong>
        <span>{{ Math.ceil(summary.consumedMl / portionMl) }} / {{ portionsPerDay }} порц.</span>
      </div>
    </div>

    <div class="actions-row">
      <button class="primary-button" type="button" @click="emit('drink')">Выпил {{ portionMl }} мл</button>
      <button class="ghost-button" type="button" :disabled="summary.consumedMl === 0" @click="emit('undo')">Отменить</button>
    </div>
  </section>
</template>
