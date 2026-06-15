"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

/**
 * MarkdownGuide Component
 *
 * Показывает справку по Markdown синтаксису для преподавателей
 * Помогает писать красиво оформленный контент уроков
 */
export function MarkdownGuide() {
  const sections = [
    {
      title: "Заголовки",
      icon: "📝",
      examples: [
        { markdown: "# Заголовок 1", result: "Самый крупный заголовок" },
        { markdown: "## Заголовок 2", result: "Средний заголовок" },
        { markdown: "### Заголовок 3", result: "Маленький заголовок" },
      ],
    },
    {
      title: "Текстовое форматирование",
      icon: "✏️",
      examples: [
        { markdown: "**жирный текст**", result: "Жирный текст" },
        { markdown: "*курсив*", result: "Курсив" },
        { markdown: "***жирный курсив***", result: "Жирный курсив" },
        { markdown: "`встроенный код`", result: "Встроенный код" },
      ],
    },
    {
      title: "Ссылки и изображения",
      icon: "🔗",
      examples: [
        {
          markdown: "[текст ссылки](https://example.com)",
          result: "Гиперссылка",
        },
        {
          markdown: "![описание](https://example.com/image.jpg)",
          result: "Изображение",
        },
      ],
    },
    {
      title: "Списки",
      icon: "📋",
      examples: [
        {
          markdown: "- Пункт 1\\n- Пункт 2\\n- Пункт 3",
          result: "Неупорядоченный список",
        },
        {
          markdown: "1. Первый\\n2. Второй\\n3. Третий",
          result: "Упорядоченный список",
        },
      ],
    },
    {
      title: "Блоки кода",
      icon: "💻",
      examples: [
        {
          markdown: '```js\\nconst x = 10;\\nconsole.log(x);\\n```',
          result: "JavaScript код с подсветкой",
        },
        {
          markdown: '```tsx\\nfunction Component() {\\n  return <div>Hello</div>;\\n}\\n```',
          result: "React/TypeScript код",
        },
        {
          markdown: '```python\\ndef hello():\\n    print("Hello")\\n```',
          result: "Python код",
        },
      ],
    },
    {
      title: "Таблицы",
      icon: "📊",
      examples: [
        {
          markdown: `| Заголовок 1 | Заголовок 2 |
|-------------|-------------|
| Ячейка 1    | Ячейка 2    |
| Ячейка 3    | Ячейка 4    |`,
          result: "Таблица с границами",
        },
      ],
    },
    {
      title: "Цитаты",
      icon: "💬",
      examples: [
        {
          markdown: "> Это цитата\\n> Вторая строка цитаты",
          result: "Блок цитаты",
        },
      ],
    },
    {
      title: "Горизонтальная линия",
      icon: "━━",
      examples: [
        { markdown: "---", result: "Горизонтальная линия" },
      ],
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📚 Справка по Markdown синтаксису
        </CardTitle>
        <CardDescription>
          Используйте эти элементы для красивого форматирования контента урока
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sections.map((section, idx) => (
            <Collapsible key={idx} defaultOpen={idx === 0}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <span className="font-semibold">{section.title}</span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 space-y-3">
                {section.examples.map((example, exIdx) => (
                  <div
                    key={exIdx}
                    className="border rounded-lg p-3 space-y-2 bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        Markdown
                      </Badge>
                    </div>
                    <code className="block bg-slate-900 dark:bg-slate-800 text-slate-100 p-3 rounded text-sm font-mono overflow-x-auto">
                      {example.markdown}
                    </code>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Результат
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      {example.result}
                    </p>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 <strong>Совет:</strong> Переключайтесь на вкладку &quot;Предпросмотр&quot;
            чтобы видеть, как будет выглядеть ваш контент для студентов в реальном времени.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
