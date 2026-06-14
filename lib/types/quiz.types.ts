import { z } from "zod";

export const quizOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Вариант ответа не может быть пустым"),
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Вопрос не может быть пустым"),
  options: z.array(quizOptionSchema).min(2, "Минимум 2 варианта ответа"),
  correctAnswerId: z.string(),
});

export const quizContentSchema = z.object({
  passingScore: z.number().min(1).max(100),
  timeLimit: z.number().positive().optional(),
  questions: z.array(quizQuestionSchema).min(1, "Добавьте хотя бы один вопрос"),
});

export type QuizOption = z.infer<typeof quizOptionSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type QuizContent = z.infer<typeof quizContentSchema>;

export function parseQuizContent(content: string): QuizContent | null {
  try {
    const parsed = JSON.parse(content);
    const result = quizContentSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function serializeQuizContent(quiz: QuizContent): string {
  return JSON.stringify(quiz);
}

export function createEmptyQuiz(): QuizContent {
  const questionId = `q-${Date.now()}`;

  return {
    passingScore: 70,
    questions: [
      {
        id: questionId,
        text: "",
        options: [
          { id: `${questionId}-a`, text: "" },
          { id: `${questionId}-b`, text: "" },
        ],
        correctAnswerId: `${questionId}-a`,
      },
    ],
  };
}

export function validateQuizContent(quiz: QuizContent): string | null {
  const result = quizContentSchema.safeParse(quiz);
  if (!result.success) {
    return result.error.issues[0]?.message ?? "Некорректные данные теста";
  }

  for (const question of quiz.questions) {
    const hasCorrectOption = question.options.some(
      (option) => option.id === question.correctAnswerId,
    );
    if (!hasCorrectOption) {
      return "У каждого вопроса должен быть выбран правильный ответ";
    }
  }

  return null;
}
