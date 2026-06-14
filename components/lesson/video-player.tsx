"use client";

import { useMemo } from "react";
import { ExternalLink, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getVideoEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;

      const embedMatch = parsed.pathname.match(/\/embed\/([\w-]+)/);
      if (embedMatch?.[1]) {
        return `https://www.youtube.com/embed/${embedMatch[1]}`;
      }
    }

    if (host === "youtu.be") {
      const videoId = parsed.pathname.slice(1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host.includes("vimeo.com")) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const videoId = parts[parts.length - 1];
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }

    if (host.includes("rutube.ru")) {
      const match = parsed.pathname.match(/\/video\/([a-f0-9]+)/i);
      if (match?.[1]) {
        return `https://rutube.ru/play/embed/${match[1]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export function VideoPlayer({ url, title, className }: VideoPlayerProps) {
  const embedUrl = useMemo(() => getVideoEmbed(url), [url]);
  const isFile = useMemo(() => isDirectVideoFile(url), [url]);

  if (isFile) {
    return (
      <section className={className}>
        <div className="overflow-hidden rounded-xl border bg-black shadow-lg">
          <video
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full bg-black"
            title={title}
          >
            <source src={url} />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        </div>
      </section>
    );
  }

  if (embedUrl) {
    return (
      <section className={className}>
        <div className="overflow-hidden rounded-xl border bg-black shadow-lg">
          <div className="relative aspect-video w-full">
            <iframe
              src={embedUrl}
              title={title ?? "Видео урок"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Play className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-medium">Видео доступно по ссылке</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Этот формат нельзя встроить — откройте видео в новой вкладке
            </p>
          </div>
          <Button asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Открыть видео
            </a>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
