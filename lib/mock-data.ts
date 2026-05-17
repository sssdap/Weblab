import type {
  User,
  CourseModule,
  ChapterContent,
  Quiz,
  ProjectSubmission,
  UserProgress,
  Activity,
  AdminStats,
  StudentSummary,
} from "./types";

// Current user (student)
export const currentUser: User = {
  id: "user-1",
  email: "sasha.k@school.lab",
  name: "Саша Козлов",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SashaK",
  role: "student",
  createdAt: new Date("2024-01-15"),
};

// Teacher user
export const teacherUser: User = {
  id: "teacher-1",
  email: "maria.petrova@school.lab",
  name: "Мария Петрова",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MariaP",
  role: "teacher",
  createdAt: new Date("2023-06-01"),
};

// Course modules with progress
export const courseModules: CourseModule[] = [
  {
    id: "module-1",
    number: 1,
    title: "Введение в веб-разработку",
    description: "Как устроен интернет: браузеры, серверы и протокол HTTP.",
    duration: "2 ч",
    lessons: [
      { id: "lesson-1-1", title: "Как работает веб", type: "video", duration: "15 мин", completed: true },
      { id: "lesson-1-2", title: "Браузеры и инструменты разработчика", type: "video", duration: "20 мин", completed: true },
      { id: "lesson-1-3", title: "HTTP и HTTPS", type: "theory", duration: "15 мин", completed: true },
      { id: "lesson-1-4", title: "Настраиваем рабочее место", type: "practice", duration: "30 мин", completed: true },
    ],
    isLocked: false,
    progress: 100,
  },
  {
    id: "module-2",
    number: 2,
    title: "Основы HTML",
    description: "Семантика HTML5, формы и структура страницы.",
    duration: "3 ч",
    lessons: [
      { id: "lesson-2-1", title: "Структура HTML-документа", type: "video", duration: "20 мин", completed: true },
      { id: "lesson-2-2", title: "Текст и типографика", type: "video", duration: "25 мин", completed: true },
      { id: "lesson-2-3", title: "Ссылки и навигация", type: "theory", duration: "15 мин", completed: true },
      { id: "lesson-2-4", title: "Картинки и медиа", type: "video", duration: "20 мин", completed: true },
      { id: "lesson-2-5", title: "HTML-формы", type: "practice", duration: "40 мин", completed: false },
      { id: "lesson-2-6", title: "Семантический HTML5", type: "theory", duration: "20 мин", completed: false },
    ],
    isLocked: false,
    progress: 67,
  },
  {
    id: "module-3",
    number: 3,
    title: "CSS: стили и вёрстка",
    description: "Красивые макеты на Grid, Flexbox и современных приёмах.",
    duration: "4 ч",
    lessons: [
      { id: "lesson-3-1", title: "Селекторы и специфичность", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-3-2", title: "Блочная модель и отступы", type: "video", duration: "20 мин", completed: false },
      { id: "lesson-3-3", title: "Цвета и шрифты", type: "theory", duration: "15 мин", completed: false },
      { id: "lesson-3-4", title: "Вёрстка на Flexbox", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-3-5", title: "CSS Grid", type: "video", duration: "35 мин", completed: false },
      { id: "lesson-3-6", title: "Позиционирование", type: "theory", duration: "20 мин", completed: false },
      { id: "lesson-3-7", title: "Переходы и анимации", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-3-8", title: "Лучшие практики CSS", type: "practice", duration: "40 мин", completed: false },
    ],
    isLocked: false,
    progress: 0,
  },
  {
    id: "module-4",
    number: 4,
    title: "Адаптивный дизайн",
    description: "Сайты на любых экранах: медиазапросы и mobile-first.",
    duration: "3 ч",
    lessons: [
      { id: "lesson-4-1", title: "Подход mobile-first", type: "video", duration: "20 мин", completed: false },
      { id: "lesson-4-2", title: "Медиазапросы", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-4-3", title: "Адаптивные картинки", type: "theory", duration: "15 мин", completed: false },
      { id: "lesson-4-4", title: "Адаптивная типографика", type: "video", duration: "20 мин", completed: false },
      { id: "lesson-4-5", title: "Собираем адаптивный макет", type: "practice", duration: "45 мин", completed: false },
    ],
    isLocked: true,
    progress: 0,
  },
  {
    id: "module-5",
    number: 5,
    title: "Основы JavaScript",
    description: "Переменные, функции, циклы и работа с DOM.",
    duration: "5 ч",
    lessons: [
      { id: "lesson-5-1", title: "Переменные и типы данных", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-5-2", title: "Операторы и выражения", type: "video", duration: "20 мин", completed: false },
      { id: "lesson-5-3", title: "Управление потоком", type: "theory", duration: "20 мин", completed: false },
      { id: "lesson-5-4", title: "Функции", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-5-5", title: "Массивы и объекты", type: "video", duration: "35 мин", completed: false },
      { id: "lesson-5-6", title: "Работа с DOM", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-5-7", title: "События", type: "theory", duration: "25 мин", completed: false },
      { id: "lesson-5-8", title: "Обработка ошибок", type: "video", duration: "20 мин", completed: false },
      { id: "lesson-5-9", title: "Отладка", type: "theory", duration: "15 мин", completed: false },
      { id: "lesson-5-10", title: "Мини-проект на JS", type: "practice", duration: "60 мин", completed: false },
    ],
    isLocked: true,
    progress: 0,
  },
  {
    id: "module-6",
    number: 6,
    title: "Продвинутый JavaScript",
    description: "async/await, возможности ES6+ и современные паттерны.",
    duration: "4 ч",
    lessons: [
      { id: "lesson-6-1", title: "Возможности ES6+", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-6-2", title: "Стрелки и деструктуризация", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-6-3", title: "Промисы", type: "theory", duration: "25 мин", completed: false },
      { id: "lesson-6-4", title: "Async/await", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-6-5", title: "Модули", type: "video", duration: "20 мин", completed: false },
      { id: "lesson-6-6", title: "Классы и ООП", type: "theory", duration: "25 мин", completed: false },
      { id: "lesson-6-7", title: "Функциональный стиль", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-6-8", title: "Сложные паттерны", type: "practice", duration: "45 мин", completed: false },
    ],
    isLocked: true,
    progress: 0,
  },
  {
    id: "module-7",
    number: 7,
    title: "Основы React",
    description: "Интерфейсы на компонентах, состоянии и пропсах.",
    duration: "5 ч",
    lessons: [
      { id: "lesson-7-1", title: "Знакомство с React", type: "video", duration: "20 мин", completed: false },
      { id: "lesson-7-2", title: "JSX", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-7-3", title: "Компоненты", type: "theory", duration: "20 мин", completed: false },
      { id: "lesson-7-4", title: "Пропсы", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-7-5", title: "Состояние", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-7-6", title: "Обработка событий", type: "theory", duration: "20 мин", completed: false },
      { id: "lesson-7-7", title: "Условный рендер", type: "video", duration: "20 мин", completed: false },
      { id: "lesson-7-8", title: "Списки и ключи", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-7-9", title: "Формы в React", type: "theory", duration: "25 мин", completed: false },
      { id: "lesson-7-10", title: "Мини-проект на React", type: "practice", duration: "60 мин", completed: false },
    ],
    isLocked: true,
    progress: 0,
  },
  {
    id: "module-8",
    number: 8,
    title: "Управление состоянием",
    description: "Сложное состояние: хуки и контекст.",
    duration: "3 ч",
    lessons: [
      { id: "lesson-8-1", title: "useState подробно", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-8-2", title: "useEffect", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-8-3", title: "useRef и useMemo", type: "theory", duration: "20 мин", completed: false },
      { id: "lesson-8-4", title: "Context API", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-8-5", title: "Свои хуки", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-8-6", title: "Проект: состояние", type: "practice", duration: "50 мин", completed: false },
    ],
    isLocked: true,
    progress: 0,
  },
  {
    id: "module-9",
    number: 9,
    title: "Работа с API",
    description: "REST и fetch: связываем фронт с бэкендом.",
    duration: "3 ч",
    lessons: [
      { id: "lesson-9-1", title: "Идея REST API", type: "video", duration: "20 мин", completed: false },
      { id: "lesson-9-2", title: "Fetch API", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-9-3", title: "Ответы сервера", type: "theory", duration: "20 мин", completed: false },
      { id: "lesson-9-4", title: "Загрузка и ошибки", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-9-5", title: "Проект: интеграция API", type: "practice", duration: "60 мин", completed: false },
    ],
    isLocked: true,
    progress: 0,
  },
  {
    id: "module-10",
    number: 10,
    title: "Next.js и деплой",
    description: "Production на Next.js и публикация в облаке.",
    duration: "4 ч",
    lessons: [
      { id: "lesson-10-1", title: "Введение в Next.js", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-10-2", title: "Роутинг по файлам", type: "video", duration: "20 мин", completed: false },
      { id: "lesson-10-3", title: "Server Components", type: "theory", duration: "25 мин", completed: false },
      { id: "lesson-10-4", title: "Загрузка данных", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-10-5", title: "API Routes", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-10-6", title: "Деплой на Vercel", type: "theory", duration: "20 мин", completed: false },
      { id: "lesson-10-7", title: "Проект на Next.js", type: "practice", duration: "60 мин", completed: false },
    ],
    isLocked: true,
    progress: 0,
  },
  {
    id: "module-11",
    number: 11,
    title: "Тесты и практики",
    description: "Тесты, скорость и аккуратный код.",
    duration: "3 ч",
    lessons: [
      { id: "lesson-11-1", title: "Зачем нужны тесты", type: "video", duration: "25 мин", completed: false },
      { id: "lesson-11-2", title: "Юнит-тесты с Jest", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-11-3", title: "React Testing Library", type: "theory", duration: "25 мин", completed: false },
      { id: "lesson-11-4", title: "Оптимизация производительности", type: "video", duration: "30 мин", completed: false },
      { id: "lesson-11-5", title: "Качество кода", type: "practice", duration: "40 мин", completed: false },
    ],
    isLocked: true,
    progress: 0,
  },
  {
    id: "module-12",
    number: 12,
    title: "Финальный проект",
    description: "Собираем полноценное приложение из всего курса.",
    duration: "6 ч",
    lessons: [
      { id: "lesson-12-1", title: "План проекта", type: "theory", duration: "30 мин", completed: false },
      { id: "lesson-12-2", title: "Сборка проекта", type: "practice", duration: "240 мин", completed: false },
      { id: "lesson-12-3", title: "Защита проекта", type: "video", duration: "30 мин", completed: false },
    ],
    isLocked: true,
    progress: 0,
  },
];

// Chapter content example
export const chapterContent: ChapterContent = {
  id: "lesson-2-5",
  moduleId: "module-2",
  title: "HTML-формы",
  videoUrl: "https://vk.com/video_ext.php?oid=-12345&id=123456789",
  theory: `
## HTML-формы

Формы нужны, чтобы собирать данные от пользователя и отправлять их на сервер.

### Базовая структура

Контейнер — элемент \`<form>\`, внутри — поля ввода и кнопка отправки.

### Атрибуты

- **action** — куда отправить данные
- **method** — GET или POST
- **enctype** — как кодировать файл и текст

### Типы полей в HTML5

Подходят \`text\`, \`email\`, \`password\`, \`number\`, \`date\`, \`checkbox\`, \`radio\`, \`file\` и другие.
  `,
  codeExamples: [
    {
      id: "code-1",
      title: "Контактная форма",
      language: "html",
      code: `<form action="/contact" method="POST">
  <div class="form-group">
    <label for="name">Имя</label>
    <input type="text" id="name" name="name" placeholder="Анна Иванова" required>
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" placeholder="anna@школа.lab" required>
  </div>
  <div class="form-group">
    <label for="message">Сообщение</label>
    <textarea id="message" name="message" rows="4" required></textarea>
  </div>
  <button type="submit">Отправить</button>
</form>`,
    },
    {
      id: "code-2",
      title: "Форма входа с проверкой",
      language: "html",
      code: `<form action="/login" method="POST">
  <input type="email" name="email" placeholder="Email" required>
  <input type="password" name="password" placeholder="Пароль" minlength="8" required>
  <label><input type="checkbox" name="remember"> Запомнить меня</label>
  <button type="submit">Войти</button>
</form>`,
    },
  ],
  hasTest: true,
};

// Sample quiz
export const sampleQuiz: Quiz = {
  id: "quiz-2",
  moduleId: "module-2",
  title: "Тест: основы HTML",
  questions: [
    {
      id: "q1",
      text: "Какой тег задаёт главный заголовок страницы?",
      options: [
        { id: "q1-a", text: "<heading>" },
        { id: "q1-b", text: "<h1>" },
        { id: "q1-c", text: "<head>" },
        { id: "q1-d", text: "<main>" },
      ],
      correctAnswerId: "q1-b",
    },
    {
      id: "q2",
      text: "Зачем у картинки атрибут alt?",
      options: [
        { id: "q2-a", text: "Запасной URL картинки" },
        { id: "q2-b", text: "Выравнивание" },
        { id: "q2-c", text: "Текст для скринридеров и если файл не загрузился" },
        { id: "q2-d", text: "Высота изображения" },
      ],
      correctAnswerId: "q2-c",
    },
    {
      id: "q3",
      text: "Какой тип поля для email?",
      options: [
        { id: "q3-a", text: "type=\"text\"" },
        { id: "q3-b", text: "type=\"mail\"" },
        { id: "q3-c", text: "type=\"email\"" },
        { id: "q3-d", text: "type=\"address\"" },
      ],
      correctAnswerId: "q3-c",
    },
    {
      id: "q4",
      text: "Какой тег делает перенос строки?",
      options: [
        { id: "q4-a", text: "<break>" },
        { id: "q4-b", text: "<lb>" },
        { id: "q4-c", text: "<br>" },
        { id: "q4-d", text: "<newline>" },
      ],
      correctAnswerId: "q4-c",
    },
    {
      id: "q5",
      text: "Какой элемент в HTML5 для блока навигации?",
      options: [
        { id: "q5-a", text: "<navigation>" },
        { id: "q5-b", text: "<nav>" },
        { id: "q5-c", text: "<menu>" },
        { id: "q5-d", text: "<links>" },
      ],
      correctAnswerId: "q5-b",
    },
  ],
  timeLimit: 600,
  passingScore: 70,
};

// Project submissions
export const projectSubmissions: ProjectSubmission[] = [
  {
    id: "sub-1",
    userId: "user-1",
    moduleId: "module-1",
    githubUrl: "https://github.com/sashakozlov/web-intro-lab",
    description: "Первая работа: простая страница про технологии веба.",
    status: "approved",
    grade: 9,
    feedback: "Классная структура HTML и семантика! Добавь чуть больше комментариев в код — так проще возвращаться к проекту.",
    submittedAt: new Date("2024-02-01"),
    reviewedAt: new Date("2024-02-03"),
    reviewedBy: "teacher-1",
  },
  {
    id: "sub-2",
    userId: "user-1",
    moduleId: "module-2",
    githubUrl: "https://github.com/sashakozlov/html-forms-lab",
    description: "Контактная форма с разными типами полей и атрибутами валидации.",
    status: "pending",
    submittedAt: new Date("2024-02-15"),
  },
];

// User progress
export const userProgress: UserProgress = {
  userId: "user-1",
  completedModules: ["module-1"],
  completedLessons: [
    "lesson-1-1", "lesson-1-2", "lesson-1-3", "lesson-1-4",
    "lesson-2-1", "lesson-2-2", "lesson-2-3", "lesson-2-4",
  ],
  currentModuleId: "module-2",
  currentLessonId: "lesson-2-5",
  overallProgress: 15,
  testScores: [
    { moduleId: "module-1", score: 90, maxScore: 100, completedAt: new Date("2024-01-28") },
  ],
  lastActivity: new Date(),
};

// Activity feed
export const activities: Activity[] = [
  {
    id: "act-1",
    userId: "user-1",
    type: "lesson_completed",
    title: "Урок пройден",
    description: "Ты завершил урок «Картинки и медиа» в модуле «Основы HTML»",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "act-2",
    userId: "user-1",
    type: "project_submitted",
    title: "Проект отправлен",
    description: "Отправил на проверку проект по HTML-формам",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "act-3",
    userId: "user-1",
    type: "test_passed",
    title: "Тест сдан",
    description: "Тест «Введение в веб-разработку» — 90%",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "act-4",
    userId: "user-1",
    type: "project_approved",
    title: "Проект принят",
    description: "Работа «Введение в веб» одобрена — оценка 9/10",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
];

// Admin stats
export const adminStats: AdminStats = {
  totalStudents: 156,
  activeStudents: 89,
  averageProgress: 34,
  averageTestScore: 78,
  pendingSubmissions: 12,
  completionRate: 23,
};

// Student summaries for admin
export const studentSummaries: StudentSummary[] = [
  {
    id: "user-1",
    name: "Саша Козлов",
    email: "sasha.k@school.lab",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SashaK",
    progress: 15,
    averageTestScore: 90,
    submissionsCount: 2,
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    status: "active",
  },
  {
    id: "user-2",
    name: "Маша Иванова",
    email: "masha.i@school.lab",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MashaI",
    progress: 45,
    averageTestScore: 85,
    submissionsCount: 5,
    lastActive: new Date(Date.now() - 1000 * 60 * 60),
    status: "active",
  },
  {
    id: "user-3",
    name: "Дима Соколов",
    email: "dima.s@school.lab",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DimaS",
    progress: 72,
    averageTestScore: 92,
    submissionsCount: 8,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: "active",
  },
  {
    id: "user-4",
    name: "Катя Орлова",
    email: "katya.o@school.lab",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KatyaO",
    progress: 100,
    averageTestScore: 95,
    submissionsCount: 12,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "completed",
  },
  {
    id: "user-5",
    name: "Лёша Волков",
    email: "lesha.v@school.lab",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeshaV",
    progress: 8,
    averageTestScore: 65,
    submissionsCount: 1,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    status: "inactive",
  },
  {
    id: "user-6",
    name: "Настя Белова",
    email: "nastya.b@school.lab",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NastyaB",
    progress: 58,
    averageTestScore: 88,
    submissionsCount: 6,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "active",
  },
];

// Pending submissions for admin review
export const pendingSubmissions: ProjectSubmission[] = [
  {
    id: "sub-2",
    userId: "user-1",
    moduleId: "module-2",
    githubUrl: "https://github.com/sashakozlov/html-forms-lab",
    description: "Контактная форма с разными типами полей и валидацией.",
    status: "pending",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "sub-3",
    userId: "user-2",
    moduleId: "module-3",
    githubUrl: "https://github.com/mashaivanova/css-layout-lab",
    description: "Адаптивный макет на CSS Grid и Flexbox.",
    status: "pending",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "sub-4",
    userId: "user-3",
    moduleId: "module-5",
    githubUrl: "https://github.com/dimasokolov/js-todo-lab",
    description: "Интерактивный список дел с localStorage.",
    status: "pending",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
];
