<script setup lang="ts">
import { computed } from "vue";
import { ref } from "vue";
import { useDark, useOnline, useToggle } from "@vueuse/core";
import ProfileForm from "@/features/profile/ui/ProfileForm.vue";
import HistoryCalendar from "@/features/water-balance/ui/HistoryCalendar.vue";
import TodayProgress from "@/features/water-balance/ui/TodayProgress.vue";
import { useWaterBalance } from "@/features/water-balance/model/use-water-balance";

const online = useOnline();
const isDark = useDark();
const toggleDark = useToggle(isDark);
const waterBalance = useWaterBalance();
const activeTab = ref<"today" | "calendar" | "profile">("today");

const themeLabel = computed(() =>
  isDark.value ? "Светлая тема" : "Тёмная тема",
);
const portionMl = computed(() => waterBalance.profile.value?.portionMl ?? 500);

const toggleTheme = (): void => {
  toggleDark();
};

const tabs = [
  { id: "today", label: "Сегодня", icon: "💧" },
  { id: "calendar", label: "Календарь", icon: "📅" },
  { id: "profile", label: "Профиль", icon: "👤" },
] as const;
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <div class="brand">
        <span class="brand-icon">💧</span>
        <div>
          <strong>Water Balance</strong>
          <small>{{
            online ? "Онлайн и готово к офлайну" : "Работает офлайн"
          }}</small>
        </div>
      </div>

      <button class="theme-button" type="button" @click="toggleTheme">
        {{ themeLabel }}
      </button>
    </header>

    <section v-if="!waterBalance.hasProfile.value" class="screen">
      <section class="intro">
        <p class="eyebrow">Offline-first PWA</p>
        <h1>Личный водный баланс, который всегда под рукой</h1>
        <p>
          Создайте профиль, чтобы приложение рассчитало дневную норму и начало
          вести историю.
        </p>
      </section>

      <ProfileForm :profile="null" @save="waterBalance.saveProfile" />
    </section>

    <template v-else>
      <Transition name="screen-fade" mode="out-in">
        <section v-if="activeTab === 'today'" key="today" class="screen">
          <TodayProgress
            :summary="waterBalance.currentSummary.value"
            :portion-ml="portionMl"
            :portions-per-day="waterBalance.portionsPerDay.value"
            @drink="waterBalance.addPortion"
            @undo="waterBalance.undoLastPortion"
          />
        </section>

        <section
          v-else-if="activeTab === 'calendar'"
          key="calendar"
          class="screen"
        >
          <HistoryCalendar :summaries="waterBalance.recentSummaries.value" />
        </section>

        <section v-else key="profile" class="screen">
          <ProfileForm
            :profile="waterBalance.profile.value"
            @save="waterBalance.saveProfile"
          />
        </section>
      </Transition>

      <nav class="bottom-nav" aria-label="Основная навигация">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span>{{ tab.icon }}</span>
          <strong>{{ tab.label }}</strong>
        </button>
      </nav>
    </template>
  </main>
</template>
