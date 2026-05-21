<script setup lang="ts">
import { computed } from "vue";
import { useTransition } from "@vueuse/core";
import type { WaterDaySummary } from "@/entities/water-day/model/types";

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
const animatedConsumedMl = useTransition(
  computed(() => props.summary.consumedMl),
  { duration: 520 },
);
const animatedTargetMl = useTransition(
  computed(() => props.summary.targetMl),
  { duration: 520 },
);
const animatedProgressRatio = useTransition(
  computed(() => props.summary.progressRatio),
  { duration: 620 },
);
const animatedRemainingMl = computed(() =>
  Math.max(animatedTargetMl.value - animatedConsumedMl.value, 0),
);
const animatedPercent = computed(() =>
  Math.round(animatedProgressRatio.value * 100),
);
const animatedPortions = computed(() =>
  Math.ceil(animatedConsumedMl.value / props.portionMl),
);
</script>

<template>
  <section class="card hero-card">
    <div class="hero-copy">
      <p class="eyebrow">Сегодня</p>
      <h1>
        {{ liters(animatedConsumedMl) }} / {{ liters(animatedTargetMl) }} л
      </h1>
      <p class="muted">
        {{
          summary.isCompleted
            ? "Норма выполнена. Отличная работа!"
            : `Осталось ${liters(animatedRemainingMl)} л`
        }}
      </p>
    </div>

    <div
      class="water-ring"
      :style="{ '--progress': `${animatedProgressRatio * 100}%` }"
    >
      <div>
        <strong>{{ animatedPercent }}%</strong>
        <span>{{ animatedPortions }} / {{ portionsPerDay }} порц.</span>
      </div>
    </div>

    <div class="actions-row">
      <button class="primary-button" type="button" @click="emit('drink')">
        Выпил {{ portionMl }} мл
      </button>
      <button
        class="ghost-button"
        type="button"
        :disabled="summary.consumedMl === 0"
        @click="emit('undo')"
      >
        Отменить
      </button>
    </div>
  </section>
</template>
