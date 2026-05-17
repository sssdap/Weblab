"use client";

import { Card, CardContent } from "@/components/ui/card";

interface LessonContentProps {
  content: string;
}

export function LessonContent({ content }: LessonContentProps) {
  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    const lines = text.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLanguage = "";

    lines.forEach((line, index) => {
      // Code block start
      if (line.startsWith("```") && !inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
        codeContent = [];
        return;
      }

      // Code block end
      if (line.startsWith("```") && inCodeBlock) {
        inCodeBlock = false;
        elements.push(
          <pre
            key={`code-${index}`}
            className="my-4 overflow-x-auto rounded-lg bg-secondary p-4 text-sm"
          >
            <code className={`language-${codeLanguage}`}>
              {codeContent.join("\n")}
            </code>
          </pre>
        );
        return;
      }

      // Inside code block
      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // H2 heading
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="mt-8 mb-4 text-xl font-semibold">
            {line.slice(3)}
          </h2>
        );
        return;
      }

      // H3 heading
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="mt-6 mb-3 text-lg font-semibold">
            {line.slice(4)}
          </h3>
        );
        return;
      }

      // List item
      if (line.startsWith("- ")) {
        elements.push(
          <li key={index} className="ml-4 text-muted-foreground">
            {formatInlineCode(line.slice(2))}
          </li>
        );
        return;
      }

      // Empty line
      if (line.trim() === "") {
        return;
      }

      // Paragraph
      elements.push(
        <p key={index} className="my-3 leading-relaxed text-muted-foreground">
          {formatInlineCode(line)}
        </p>
      );
    });

    return elements;
  };

  const formatInlineCode = (text: string) => {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="rounded bg-secondary px-1.5 py-0.5 text-sm font-mono"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      // Handle bold text
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((boldPart, j) => {
        if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
          return (
            <strong key={`${i}-${j}`} className="font-semibold text-foreground">
              {boldPart.slice(2, -2)}
            </strong>
          );
        }
        return boldPart;
      });
    });
  };

  return (
    <Card>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none py-6">
        {renderContent(content)}
      </CardContent>
    </Card>
  );
}
