<script setup lang="ts">
import { computed, ref } from "vue";
import { formatHumanDate } from "@/shared/lib/date";
import type { WaterDaySummary } from "@/entities/water-day/model/types";

const props = defineProps<{
  summaries: WaterDaySummary[];
}>();

const selectedSummary = ref<WaterDaySummary | null>(null);
const selectedProgressPercent = computed(() =>
  selectedSummary.value
    ? Math.round(selectedSummary.value.progressRatio * 100)
    : 0,
);

const liters = (ml: number): string => (ml / 1000).toFixed(1);
</script>

<template>
  <section class="card history-card">
    <div>
      <p class="eyebrow">Статистика</p>
      <h2>Последние 21 день</h2>
    </div>

    <div class="calendar-grid">
      <button
        v-for="summary in summaries"
        :key="summary.dateKey"
        type="button"
        class="day-cell"
        :class="{ completed: summary.isCompleted }"
        :title="`${formatHumanDate(summary.dateKey)}: ${liters(summary.consumedMl)} / ${liters(summary.targetMl)} л`"
        @click="selectedSummary = summary"
      >
        <span>{{ new Date(`${summary.dateKey}T12:00:00`).getDate() }}</span>
        <i
          :style="{ height: `${Math.max(summary.progressRatio * 100, 8)}%` }"
        />
      </button>
    </div>

    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="selectedSummary"
          class="modal-backdrop"
          @click.self="selectedSummary = null"
        >
          <section
            class="day-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="day-modal-title"
          >
            <button
              class="modal-close"
              type="button"
              aria-label="Закрыть"
              @click="selectedSummary = null"
            >
              ×
            </button>

            <p class="eyebrow">День</p>
            <h2 id="day-modal-title">
              {{ formatHumanDate(selectedSummary.dateKey) }}
            </h2>

            <div class="modal-progress">
              <strong
                >{{ liters(selectedSummary.consumedMl) }} /
                {{ liters(selectedSummary.targetMl) }} л</strong
              >
              <span>{{ selectedProgressPercent }}% нормы</span>
            </div>

            <div class="modal-progress-bar">
              <i :style="{ width: `${selectedProgressPercent}%` }" />
            </div>

            <p class="muted">
              {{
                selectedSummary.isCompleted
                  ? "Норма за день выполнена."
                  : `Оставалось ${liters(Math.max(selectedSummary.targetMl - selectedSummary.consumedMl, 0))} л.`
              }}
            </p>
          </section>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
