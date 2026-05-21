<script setup lang="ts">
import { formatHumanDate } from '@/shared/lib/date';
import type { WaterDaySummary } from '@/entities/water-day/model/types';

const props = defineProps<{
  summaries: WaterDaySummary[];
}>();

const liters = (ml: number): string => (ml / 1000).toFixed(1);
</script>

<template>
  <section class="card history-card">
    <div>
      <p class="eyebrow">Статистика</p>
      <h2>Последние 21 день</h2>
    </div>

    <div class="calendar-grid">
      <article
        v-for="summary in summaries"
        :key="summary.dateKey"
        class="day-cell"
        :class="{ completed: summary.isCompleted }"
        :title="`${formatHumanDate(summary.dateKey)}: ${liters(summary.consumedMl)} / ${liters(summary.targetMl)} л`"
      >
        <span>{{ new Date(`${summary.dateKey}T12:00:00`).getDate() }}</span>
        <i :style="{ height: `${Math.max(summary.progressRatio * 100, 8)}%` }" />
      </article>
    </div>
  </section>
</template>
