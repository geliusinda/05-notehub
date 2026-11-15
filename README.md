# NoteHub — домашнє завдання №5

React + TypeScript + Vite. Axios, TanStack Query, Formik, Yup, React Paginate, use-debounce, modern-normalize, CSS Modules.

## Запуск

1. `npm install`
2. Скопіюйте `.env.example` у `.env.local`.
3. Отримайте токен у https://notehub-public.goit.study/api/docs через `POST /auth` зі своєю поштою.
4. Запишіть `VITE_NOTEHUB_TOKEN=ваш_токен` у `.env.local`.
5. `npm run dev`

## Перевірка

```sh
npm run build
npm run lint
npm run format:check
```

Отримання нотаток, пагінація по 12 записів, пошук із затримкою 300 мс, створення й видалення з інвалідацією кешу. Модальне вікно використовує портал, закривається через Escape, бекдроп і Cancel, блокує прокручування та утримує фокус. Formik/Yup перевіряють заголовок (3–50), контент (до 500) і тег. Передбачено стани завантаження, помилки й порожньої колекції.

## Публікація

Створіть репозиторій `05-notehub` у GitHub. Імпортуйте його у Vercel: Framework Vite, Build `npm run build`, Output `dist`. Додайте `VITE_NOTEHUB_TOKEN` у Environment Variables до збірки. Для здачі потрібні посилання на репозиторій і deployment.

Не комітьте `.env.local`. Змінні VITE потрапляють у клієнтську збірку — це схема навчального API з умови.

## Стилі

Посилання https://github.com/goitacademy/react-notehub-styles під час виконання відображало порожній список файлів; завантаження CSS повертало 404. Додано власні CSS-модулі зі структурою та класами з умови. Коли оригінали стануть доступними, замініть відповідні `.module.css`.
