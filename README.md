# Water Balance

Offline-first PWA приложение для отслеживания водного баланса.

## Стек

- Vue 3.5 Composition API + `<script setup>`
- TypeScript
- Vite
- vite-plugin-pwa
- VueUse
- FSD-подход: `shared`, `entities`, `features`, `app`

## Запуск

```bash
npm install
npm run dev
```

Dev-сервер запускается с `--host 0.0.0.0`, чтобы приложение можно было открыть с iPhone в одной локальной сети.

## PWA и офлайн

После первого открытия с интернетом приложение кеширует shell и assets через service worker. Данные пользователя хранятся локально в браузере в `localStorage` под ключом `water-balance:v1`.

## Архитектура хранения

Работа с текущим локальным persistence изолирована в `src/shared/api/water-balance-storage.ts`. При появлении backend этот слой можно заменить на remote/local sync adapter, не переписывая UI и доменную модель.
