"use client";

import { QuizInterface } from "@/components/tests/quiz-interface";
import { sampleQuiz } from "@/lib/mock-data";

export function DemoQuiz() {
  return (
    <QuizInterface
      title={sampleQuiz.title}
      quiz={{
        passingScore: sampleQuiz.passingScore,
        timeLimit: sampleQuiz.timeLimit,
        questions: sampleQuiz.questions,
      }}
    />
  );
}
