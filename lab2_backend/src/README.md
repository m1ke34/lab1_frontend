# Сервіс «Репорт вразливості» - Бекенд (Лабораторна робота №3)

Це серверна частина вебзастосунку, яка використовує вбудовану реляційну базу даних SQLite.

## Як запустити застосунок та ініціалізувати базу даних

1. Встановіть залежності (якщо ви цього ще не робили):
   npm install

2. Запустіть сервер у режимі розробки:
   npm run dev

**Ініціалізація БД:** Файл бази даних `app.db` створюється автоматично під час першого запуску сервера у папці `./data/`. Скрипт ініціалізації також автоматично створює всі необхідні таблиці та заповнює їх початковими тестовими даними (Seed).

---

## Схема бази даних

Схема складається з 3-х пов'язаних таблиць:

1. **Users** (Користувачі)
   * `id` INTEGER PRIMARY KEY
   * `email` TEXT NOT NULL UNIQUE (унікальний ідентифікатор)
   * `name` TEXT NOT NULL
   * `createdAt` TEXT NOT NULL

2. **Reports** (Вразливості)
   * `id` INTEGER PRIMARY KEY
   * `userId` INTEGER NOT NULL (Зовнішній ключ -> Users.id)
   * `title` TEXT NOT NULL
   * `severity` TEXT NOT NULL CHECK (обмеження: тільки 'Low', 'Medium', 'High', 'Critical')
   * `status` TEXT NOT NULL DEFAULT 'Open'
   * `createdAt` TEXT NOT NULL
   * *Зв'язок:* 1:N (Один користувач має багато репортів). При видаленні користувача його репорти видаляються (ON DELETE CASCADE).

3. **Comments** (Коментарі)
   * `id` INTEGER PRIMARY KEY
   * `reportId` INTEGER NOT NULL (Зовнішній ключ -> Reports.id)
   * `text` TEXT NOT NULL
   * `createdAt` TEXT NOT NULL
   * *Зв'язок:* 1:N (Один репорт має багато коментарів).

---

## Приклади запитів

**1. Отримання списку репортів (JOIN + ORDER BY + LIMIT)**
Цей запит об'єднує таблиці `Reports` та `Users`, щоб повернути ім'я репортера, сортує за спаданням і обмежує вибірку:
curl -X GET http://localhost:3000/api/reports

**2. Створення нового репорту**
curl -X POST http://localhost:3000/api/reports \
-H "Content-Type: application/json" \
-d '{"userId": 1, "title": "XSS in Search", "severity": "High"}'

**3. Спроба створення репорту з некоректними даними (виклик 400 Bad Request)**
curl -X POST http://localhost:3000/api/reports \
-H "Content-Type: application/json" \
-d '{"userId": 1, "title": "Test", "severity": "SuperCritical"}' 
*(База даних відхилить запит через обмеження CHECK на поле severity).*

---

## Підготовка до SQLi (Навчальна демонстрація)

У поточній реалізації методу створення репорту використовується рядкова конкатенація для формування SQL-запиту:
const sql = `INSERT INTO Reports (userId, title, severity, createdAt) VALUES (${Number(userId)}, '${title}', '${severity}', '${now}');`;

**Чому це небезпечно:** 
Оскільки ввід користувача (наприклад, `title`) безпосередньо вставляється в рядок запиту, зловмисник може передати спеціально сформований рядок, який зламає логіку бази даних (це називається SQL Injection). 

Якщо в поле `title` передати таке значення:
Test', 'Low', 'Open', '2026-01-01'); DROP TABLE Reports; --

База даних інтерпретує це як два окремих запити. Спочатку вона створить репорт, а потім виконає команду `DROP TABLE Reports`, яка безповоротно видалить таблицю з усіма даними. (Примітка: в даній лабораторній цей недолік залишено навмисно для навчальних цілей).
