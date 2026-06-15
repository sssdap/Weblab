"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  QuizContent,
  QuizQuestion,
  createEmptyQuiz,
} from "@/lib/types/quiz.types";

interface QuizBuilderProps {
  value: QuizContent;
  onChange: (quiz: QuizContent) => void;
  disabled?: boolean;
}

function createQuestion(): QuizQuestion {
  const questionId = `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  return {
    id: questionId,
    text: "",
    options: [
      { id: `${questionId}-a`, text: "" },
      { id: `${questionId}-b`, text: "" },
    ],
    correctAnswerId: `${questionId}-a`,
  };
}

export function QuizBuilder({ value, onChange, disabled }: QuizBuilderProps) {
  const quiz = value ?? createEmptyQuiz();

  function updateQuiz(patch: Partial<QuizContent>) {
    onChange({ ...quiz, ...patch });
  }

  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    const questions = quiz.questions.map((question, i) =>
      i === index ? { ...question, ...patch } : question,
    );
    updateQuiz({ questions });
  }

  function addQuestion() {
    updateQuiz({ questions: [...quiz.questions, createQuestion()] });
  }

  function removeQuestion(index: number) {
    if (quiz.questions.length <= 1) return;
    updateQuiz({ questions: quiz.questions.filter((_, i) => i !== index) });
  }

  function addOption(questionIndex: number) {
    const question = quiz.questions[questionIndex];
    const optionId = `${question.id}-${Date.now()}`;
    updateQuestion(questionIndex, {
      options: [...question.options, { id: optionId, text: "" }],
    });
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    const question = quiz.questions[questionIndex];
    if (question.options.length <= 2) return;

    const removedOption = question.options[optionIndex];
    const options = question.options.filter((_, i) => i !== optionIndex);
    const correctAnswerId =
      question.correctAnswerId === removedOption.id
        ? options[0]?.id ?? ""
        : question.correctAnswerId;

    updateQuestion(questionIndex, { options, correctAnswerId });
  }

  function updateOption(
    questionIndex: number,
    optionIndex: number,
    text: string,
  ) {
    const question = quiz.questions[questionIndex];
    const options = question.options.map((option, i) =>
      i === optionIndex ? { ...option, text } : option,
    );
    updateQuestion(questionIndex, { options });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="passingScore">Проходной балл (%)</Label>
          <Input
            id="passingScore"
            type="number"
            min={1}
            max={100}
            disabled={disabled}
            value={quiz.passingScore}
            onChange={(e) =>
              updateQuiz({ passingScore: Number(e.target.value) || 70 })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeLimit">Лимит времени (сек, опционально)</Label>
          <Input
            id="timeLimit"
            type="number"
            min={60}
            disabled={disabled}
            value={quiz.timeLimit ?? ""}
            placeholder="600"
            onChange={(e) => {
              const raw = e.target.value;
              updateQuiz({
                timeLimit: raw ? Number(raw) : undefined,
              });
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((question, questionIndex) => (
          <Card key={question.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  Вопрос {questionIndex + 1}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled || quiz.questions.length <= 1}
                  onClick={() => removeQuestion(questionIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Текст вопроса</Label>
                <Textarea
                  disabled={disabled}
                  value={question.text}
                  placeholder="Введите вопрос..."
                  rows={2}
                  onChange={(e) =>
                    updateQuestion(questionIndex, { text: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3">
                <Label>Варианты ответа (отметьте правильный)</Label>
                <RadioGroup
                  value={question.correctAnswerId}
                  onValueChange={(correctAnswerId) =>
                    updateQuestion(questionIndex, { correctAnswerId })
                  }
                  className="space-y-2"
                >
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-2 rounded-lg border p-2"
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        disabled={disabled}
                      />
                      <Input
                        disabled={disabled}
                        value={option.text}
                        placeholder={`Вариант ${optionIndex + 1}`}
                        onChange={(e) =>
                          updateOption(
                            questionIndex,
                            optionIndex,
                            e.target.value,
                          )
                        }
                        className="flex-1 border-0 shadow-none focus-visible:ring-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={disabled || question.options.length <= 2}
                        onClick={() =>
                          removeOption(questionIndex, optionIndex)
                        }
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </RadioGroup>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => addOption(questionIndex)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Добавить вариант
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={addQuestion}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Добавить вопрос
      </Button>
    </div>
  );
}
