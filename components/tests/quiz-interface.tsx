"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sampleQuiz } from "@/lib/mock-data";

// Mock тест - заменить на реальные данные из Firestore
const defaultQuiz = sampleQuiz;

export function QuizInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showResult, setShowResult] = useState(false);

  const quiz = defaultQuiz;
  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleSelectAnswer = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerId) {
        correct++;
      }
    });
    return {
      correct,
      total: totalQuestions,
      percentage: Math.round((correct / totalQuestions) * 100),
    };
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResult(false);
  };

  const score = calculateScore();
  const passed = score.percentage >= quiz.passingScore;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {quiz.title}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ответь на все вопросы, чтобы завершить тест
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span>
            Вопрос {currentQuestion + 1} из {totalQuestions}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-primary/15 shadow-md shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-lg font-medium leading-snug">
            {question.text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <RadioGroup
              value={selectedAnswers[question.id] || ""}
              onValueChange={handleSelectAnswer}
              className="space-y-3"
            >
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-secondary/50 ${
                    selectedAnswers[question.id] === option.id
                      ? "border-accent bg-accent/10"
                      : "border-border"
                  }`}
                  onClick={() => handleSelectAnswer(option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>

        <div className="hidden justify-center gap-1.5 sm:flex">
          {quiz.questions.map((q, index) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentQuestion(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentQuestion
                  ? "bg-foreground"
                  : selectedAnswers[q.id]
                    ? "bg-accent"
                    : "bg-muted"
              }`}
              aria-label={`Вопрос ${index + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!selectedAnswers[question.id]}
          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground sm:w-auto"
        >
          {currentQuestion === totalQuestions - 1 ? "Готово" : "Дальше"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {passed ? (
                <>
                  <CheckCircle className="h-5 w-5 text-accent" />
                  Красава!
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  Ещё чуть-чуть
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {passed
                ? "Тест сдан — можно двигаться дальше по курсу."
                : `Нужно набрать минимум ${quiz.passingScore}%. Попробуй ещё раз!`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="text-center">
              <div
                className={`text-5xl font-bold ${
                  passed ? "text-accent" : "text-destructive"
                }`}
              >
                {score.percentage}%
              </div>
              <p className="mt-2 text-muted-foreground">
                Верно {score.correct} из {score.total}
              </p>
            </div>

            <div className="mt-6 space-y-2">
              {quiz.questions.map((q, index) => {
                const isCorrect = selectedAnswers[q.id] === q.correctAnswerId;
                return (
                  <div key={q.id} className="flex items-center gap-2 text-sm">
                    {isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-muted-foreground">
                      Вопрос {index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleRetry}>
              Заново
            </Button>
            <Button onClick={() => setShowResult(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
