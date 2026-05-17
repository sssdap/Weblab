"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Clock,
  BookOpen,
  ChevronUp,
  Download,
} from "lucide-react";
import {
  getPublishedLesson,
  getPublishedLessons,
} from "@/services/student-course.service";
import { Lesson } from "@/lib/types/lesson.types";
import { MarkdownPreview } from "@/components/admin/markdown-preview";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";
import { CompleteLessonButton } from "@/components/lesson/complete-lesson-button";

interface LessonPageParams {
  moduleId: string;
  chapterId: string;
  lessonId: string;
}

function LessonLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-40 w-full mt-4" />
      </div>
    </div>
  );
}

function LessonTypeIndicator({ type }: { type: Lesson["type"] }) {
  const map: Record<
    Lesson["type"],
    { icon: string; label: string; bgClass: string; textClass: string }
  > = {
    theory: {
      icon: "📖",
      label: "Теория",
      bgClass: "bg-accent/10",
      textClass: "text-accent",
    },
    practice: {
      icon: "✏️",
      label: "Практика",
      bgClass: "bg-success/10",
      textClass: "text-success",
    },
    video: {
      icon: "🎬",
      label: "Видео",
      bgClass: "bg-warning/10",
      textClass: "text-warning",
    },
    quiz: {
      icon: "❓",
      label: "Тест",
      bgClass: "bg-destructive/10",
      textClass: "text-destructive",
    },
  };

  const cfg = map[type];
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${cfg.bgClass} ${cfg.textClass}`}
    >
      {cfg.icon} {cfg.label}
    </div>
  );
}

function getVideoEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    // YouTube full URL
    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      // handle /embed/VIDEO
      const embedMatch = u.pathname.match(/\/embed\/([\w-]+)/);
      if (embedMatch && embedMatch[1])
        return `https://www.youtube.com/embed/${embedMatch[1]}`;
    }

    // youtu.be short link
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo
    if (host.includes("vimeo.com")) {
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts[parts.length - 1];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch (e) {
    return null;
  }
  return null;
}

function isVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export default function LessonViewPage() {
  const params = useParams() as unknown as LessonPageParams;
  const {
    moduleId: courseId,
    chapterId,
    lessonId,
  } = params ?? ({} as LessonPageParams);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundError, setNotFoundError] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Navigation state
  const [chapterLessons, setChapterLessons] = useState<Lesson[]>([]);
  const [navLoading, setNavLoading] = useState<boolean>(true);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!courseId || !chapterId || !lessonId) {
        setError("Отсутствуют необходимые параметры");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setNotFoundError(false);

      try {
        const l = await getPublishedLesson(courseId, chapterId, lessonId);
        if (!mounted) return;
        if (!l) {
          setNotFoundError(true);
          setLesson(null);
        } else {
          setLesson(l);
        }
      } catch (e) {
        if (!mounted) return;
        const message =
          e instanceof Error ? e.message : "Ошибка при загрузке урока";
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [courseId, chapterId, lessonId]);

  // Load chapter lessons for Prev/Next navigation
  useEffect(() => {
    let mounted = true;
    setNavLoading(true);

    const loadNav = async () => {
      if (!courseId || !chapterId) {
        if (mounted) {
          setChapterLessons([]);
          setNavLoading(false);
        }
        return;
      }

      try {
        const items = await getPublishedLessons(courseId, chapterId);
        if (!mounted) return;
        setChapterLessons(items);
      } catch (err) {
        console.error("[LESSON VIEW] Error loading chapter lessons:", err);
        if (mounted) setChapterLessons([]);
      } finally {
        if (mounted) setNavLoading(false);
      }
    };

    loadNav();
    return () => {
      mounted = false;
    };
  }, [courseId, chapterId]);

  // Compute prev/next based on loaded lessons and current lesson
  useEffect(() => {
    if (!lesson || chapterLessons.length === 0) {
      setPrevLesson(null);
      setNextLesson(null);
      return;
    }

    let idx = chapterLessons.findIndex((l) => l.id === lesson.id);
    if (idx === -1) {
      idx = chapterLessons.findIndex((l) => l.order === lesson.order);
    }

    if (idx === -1) {
      setPrevLesson(null);
      setNextLesson(null);
      return;
    }

    setPrevLesson(idx > 0 ? chapterLessons[idx - 1] : null);
    setNextLesson(
      idx < chapterLessons.length - 1 ? chapterLessons[idx + 1] : null,
    );
  }, [lesson, chapterLessons]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (notFoundError) {
    return (
      <>
        <AppHeader
          breadcrumbs={[
            { label: "Курсы", href: "/course" },
            { label: "Курс", href: `/course/${courseId}` },
            {
              label: "Главы",
              href: `/course/${courseId}/chapters/${chapterId}`,
            },
            { label: "Урок не найден" },
          ]}
        />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl px-4 py-6 md:px-6 lg:px-8">
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <AlertTriangle className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Урок не найден</EmptyTitle>
                <EmptyDescription>
                  Возможно урок не существует или ещё не опубликован.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href={`/course/${courseId}`}>К курсам</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/course/${courseId}/chapters/${chapterId}`}>
                      К главе
                    </Link>
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Курсы", href: "/course" },
          { label: "Курс", href: `/course/${courseId}` },
          { label: "Главы", href: `/course/${courseId}/chapters/${chapterId}` },
          { label: loading ? "Загрузка..." : lesson?.title || "Урок" },
        ]}
      />

      <main className="flex-1 overflow-auto">
        <div className="container max-w-4xl px-4 py-6 md:px-6 lg:px-8">
          {/* Back to chapter */}
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-6">
            <Link href={`/course/${courseId}/chapters/${chapterId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />К главе
            </Link>
          </Button>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <LessonLoadingSkeleton />
          ) : lesson ? (
            <article className="space-y-8">
              <header className="space-y-4">
                <LessonTypeIndicator type={lesson.type} />

                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-3">
                    {lesson.title}
                  </h1>
                  {lesson.description && (
                    <p className="text-lg text-muted-foreground">
                      {lesson.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Время: <strong>{lesson.estimatedMinutes} мин</strong>
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Открыт для просмотра</span>
                  </span>
                </div>
              </header>

              {/* Video (optional) */}
              {lesson.videoUrl ? (
                <section>
                  {isVideoFile(lesson.videoUrl) ? (
                    <video controls className="w-full rounded-md">
                      <source src={lesson.videoUrl} />
                      Ваш браузер не поддерживает воспроизведение видео.
                    </video>
                  ) : (
                    (() => {
                      const embed = getVideoEmbed(lesson.videoUrl!);
                      if (embed) {
                        return (
                          <div className="aspect-video w-full rounded-md overflow-hidden">
                            <iframe
                              src={embed}
                              title="Видео урок"
                              frameBorder={0}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        );
                      }

                      return (
                        <Card>
                          <CardContent>
                            <a
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline"
                            >
                              Открыть видео
                            </a>
                          </CardContent>
                        </Card>
                      );
                    })()
                  )}
                </section>
              ) : null}

              {/* Content */}
              <section className="prose prose-sm dark:prose-invert max-w-none">
                <MarkdownPreview content={lesson.content} />
              </section>

              {/* Attachments */}
              {lesson.attachments && lesson.attachments.length > 0 && (
                <section>
                  <Card>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium">Материалы</h3>
                      </div>
                      <div className="space-y-2">
                        {lesson.attachments.map((file) => (
                          <div
                            key={file.url}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <Download className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                {file.name}
                              </a>
                            </div>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-muted-foreground"
                            >
                              Скачать
                            </a>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* Complete Lesson Button */}
              <div className="pt-6">
                <CompleteLessonButton
                  courseId={courseId}
                  chapterId={chapterId}
                  lessonId={lessonId}
                />
              </div>

              {/* Lesson Prev/Next navigation */}
              <div className="flex items-center justify-between gap-4 pt-6">
                {navLoading ? (
                  <div className="flex w-full items-center justify-between gap-4">
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                ) : (
                  <>
                    {prevLesson ? (
                      <Button
                        variant="outline"
                        asChild
                        className="w-full sm:w-auto"
                      >
                        <Link
                          href={`/course/${courseId}/chapters/${chapterId}/lesson/${prevLesson.id}`}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Предыдущий урок
                        </Link>
                      </Button>
                    ) : (
                      <div className="w-full sm:w-auto" />
                    )}

                    {nextLesson ? (
                      <Button asChild className="w-full sm:w-auto">
                        <Link
                          href={`/course/${courseId}/chapters/${chapterId}/lesson/${nextLesson.id}`}
                        >
                          Следующий урок <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full sm:w-auto">
                        <Link
                          href={`/course/${courseId}/chapters/${chapterId}`}
                        >
                          Завершить главу →{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Footer / Navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href={`/course/${courseId}/chapters/${chapterId}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />К главе
                  </Link>
                </Button>

                <Button asChild>
                  <Link href={`/course/${courseId}`}>
                    Продолжить обучение
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ) : null}
        </div>
      </main>

      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
          title="К началу страницы"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
