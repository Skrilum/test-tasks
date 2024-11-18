# Тестовые задания

## Содержимое
- [task1/](./task1/): Реализация задания 1.
- [task2/](./task2/): Реализация задания 2.

## Как запускать
### Задание 2
Перейдите в `task2/user-service` для запуска сервиса.

```bash
cd task2/user-service
npm install
npm run start:dev
```

Запуск миграции 1_000_000 пользователей:

```bash
cd task2/user-service
npm install
npx ts-node migration/seed-users.ts

