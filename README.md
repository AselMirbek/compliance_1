# Compliance Banking System

Система Compliance для банковской организации с модулями General List и Transaction Management.

## Функциональность

### 1. General List
- Поиск клиентов по имени
- Фильтрация по Source (White List, Black List, Customer Base)
- Фильтры: Status, Origin Source, Date From/To
- Таблица с детальной информацией о клиентах
- Просмотр и редактирование записей
- Consistency Data - отображение похожих записей с процентом совпадения
- History - история изменений
- Экспорт в Excel

### 2. Add/Import Data
- Импорт данных из файла
- Ручное добавление записей
- Выбор Source (Black List, White List)
- Transaction Type (Insert, Delete)
- Origin Source и List Group

### 3. Transaction Table (для Approval)
- Таблица транзакций для подтверждения
- Отображение Match (100% совпадение зеленым цветом)
- Просмотр деталей транзакции
- Подтверждение/отклонение транзакций

### 4. Maker/Approval режимы
- Переключение между Maker и Approval режимами
- Разные права доступа в зависимости от режима

## Технологии

- React 18
- TypeScript
- Vite
- React Router
- Lucide React (иконки)

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Структура проекта

```
src/
├── components/          # React компоненты
│   ├── Layout.tsx       # Основной layout с навигацией
│   ├── GeneralListTable.tsx
│   ├── GeneralListFilters.tsx
│   ├── CustomerDetailModal.tsx
│   ├── ImportDataModal.tsx
│   └── TransactionDetailModal.tsx
├── pages/              # Страницы приложения
│   ├── GeneralList.tsx
│   └── TransactionTable.tsx
├── types/              # TypeScript типы
│   └── index.ts
├── data/               # Моковые данные
│   └── mockData.ts
├── App.tsx             # Главный компонент
└── main.tsx            # Точка входа
```

