# Taste of IRON — Browser Port MVP

## Архитектура

```
fighting/
├── src/
│   ├── core/           ← Pure TS игровая логика
│   │   ├── actor/      ← Actor класс и интерфейсы
│   │   ├── actions/    ← Attack, Block, Dodge, Rest, Idle
│   │   ├── calculators/← ActionCalculator, RoundBreakCalculator
│   │   ├── counters/   ← RoundActionCounter
│   │   ├── ai/         ← AI + конфиги сложности
│   │   ├── utils/      ← getRandomInt
│   │   ├── GameController.ts
│   │   └── index.ts
│   ├── server/         ← WebSocket сервер для мультиплеера
│   │   ├── GameServer.ts
│   │   ├── RoomManager.ts
│   │   └── index.ts
│   ├── web/            ← React SPA (Vite + Tailwind)
│   │   ├── components/
│   │   │   ├── game/   ← BattleScene, FighterCard, ActionPanel, ActionLog
│   │   │   └── ui/     ← Button, Modal, ProgressBar
│   │   ├── hooks/      ← useGame, useWebSocket, useAnimation
│   │   ├── context/    ← GameContext (React Context + useReducer)
│   │   ├── pages/      ← HomePage, GamePage, LobbyPage
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── ui/console/     ← Legacy CLI интерфейс
│   └── cli/index.ts    ← Точка входа CLI
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

**Ключевой принцип:** `core/` — чистый TypeScript без зависимостей от React/DOM/Node.

---

## Фаза 1: Настройка проекта и инфраструктура

- [ ] **1.1** Установить Vite + React + TypeScript: `npm create vite@latest fighting -- --template react-ts`
- [ ] **1.2** Установить Tailwind CSS + PostCSS
- [ ] **1.3** Настроить tailwind.config.js и postcss.config.js
- [ ] **1.4** Установить зависимости: react-router-dom, ws
- [ ] **1.5** Создать структуру директорий: src/core/, src/web/, src/server/
- [ ] **1.6** Перенести core-модули (actor, actions, calculators, counters, ai, utils) в src/core/
- [ ] **1.7** Перенести GameController.ts в src/core/
- [ ] **1.8** Сохранить src/ui/console/ для CLI отладки
- [ ] **1.9** Перенести CLI entry point (index.ts → src/cli/index.ts)
- [ ] **1.10** Перенести Server.ts в src/server/ (рефакторинг позже)
- [ ] **1.11** Удалить старые файлы src/ после переноса
- [ ] **1.12** Настроить tsconfig.json
- [ ] **1.13** Обновить package.json scripts (dev, build, preview, cli, test)
- [ ] **1.14** Проверить npm run build

## Фаза 2: Рефакторинг core-логики (чистый слой)

- [ ] **2.1** Удалить зависимость GameController от IUserInterface
- [ ] **2.2** Создать IGameEvents интерфейс — события: onStateChange, onActionResult, onRoundEnd, onMatchEnd
- [ ] **2.3** Переписать GameController.start() на push-модель через события
- [ ] **2.4** Избавиться от enquirer в core
- [ ] **2.5** Добавить GameController.selectAction(actorId, action)
- [ ] **2.6** Добавить GameController.selectPreset(actorId, preset)
- [ ] **2.7** Сделать GameController сериализуемым: getState() / loadState()
- [ ] **2.8** Вынести типы в src/core/types.ts
- [ ] **2.9** Убрать Node.js API зависимости из core
- [ ] **2.10** Экспортировать всё из src/core/index.ts

## Фаза 3: Core → React адаптер

- [ ] **3.1** Создать useGame hook
- [ ] **3.2** Создать GameContext (React Context + useReducer)
- [ ] **3.3** Тесты для GameContext

## Фаза 4: Базовый Web UI (PvE режим)

- [ ] **4.1** HomePage — выбор режима и AI сложности
- [ ] **4.2** GamePage — обертка боя
- [ ] **4.3** CharacterSelect — выбор класса бойца
- [ ] **4.4** BattleScene — контейнер боя
- [ ] **4.5** FighterCard — отображение HP/SP
- [ ] **4.6** ActionPanel — кнопки действий
- [ ] **4.7** ActionLog — лог боя
- [ ] **4.8** ResultScreen — результаты матча
- [ ] **4.9** ProgressBar — UI компонент
- [ ] **4.10** Button — UI компонент
- [ ] **4.11** Modal — UI компонент
- [ ] **4.12** Роутинг App.tsx
- [ ] **4.13** Точка входа main.tsx
- [ ] **4.14** index.html

## Фаза 5: Анимации и визуальные эффекты

- [ ] **5.1** CSS transition на ProgressBar
- [ ] **5.2** Красная вспышка при уроне
- [ ] **5.3** Зеленая вспышка при восстановлении
- [ ] **5.4** Floating combat text (+2 SP, -2 HP)
- [ ] **5.5** Задержка между фазами боя
- [ ] **5.6** Анимация появления лога
- [ ] **5.7** Адаптивный дизайн

## Фаза 6: WebSocket сервер и мультиплеер

- [ ] **6.1** Рефакторинг GameServer.ts (event-driven)
- [ ] **6.2** RoomManager (комнаты, подключения)
- [ ] **6.3** Протокол сообщений (типы)
- [ ] **6.4** Типы сообщений WebSocket
- [ ] **6.5** Обработка подключения/отключения
- [ ] **6.6** Авторитетный GameController на сервере
- [ ] **6.7** Прием выбора preset/action от клиентов
- [ ] **6.8** Синхронизация выполнения действий
- [ ] **6.9** Обработка переподключения
- [ ] **6.10** Точка входа сервера

## Фаза 7: PvP в браузере

- [ ] **7.1** useWebSocket hook
- [ ] **7.2** LobbyPage (создать/присоединиться к комнате)
- [ ] **7.3** GameContext для PvP (сервер — авторитет)
- [ ] **7.4** CharacterSelect для PvP
- [ ] **7.5** BattleScene для PvP
- [ ] **7.6** Rematch в PvP

## Фаза 8: Тестирование и полировка

- [ ] **8.1** Адаптировать существующие Jest-тесты
- [ ] **8.2** Тесты useGame hook
- [ ] **8.3** Тесты GameContext
- [ ] **8.4** Тесты GameController standalone
- [ ] **8.5** Тесты RoomManager
- [ ] **8.6** Тесты протокола сообщений
- [ ] **8.7** npm run build — без ошибок
- [ ] **8.8** npm run dev — SPA работает
- [ ] **8.9** npm run test — все проходят
- [ ] **8.10** ПРОВЕРКА: PvE полный матч
- [ ] **8.11** ПРОВЕРКА: PvP полный матч
