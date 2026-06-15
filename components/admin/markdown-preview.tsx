"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import "highlight.js/styles/atom-one-dark.css";

interface MarkdownPreviewProps {
  content: string;
}

/**
 * MarkdownPreview Component
 *
 * Renders markdown content with support for:
 * - GFM (tables, strikethrough, etc)
 * - Syntax highlighting for code blocks
 * - Proper Tailwind styling
 */
export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  // Check if content is empty
  const isEmpty = !content || content.trim().length === 0;

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {isEmpty ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <p>No content to preview</p>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Headings
                h1: ({ node, ...props }) => (
                  <h1
                    className="mt-8 mb-4 text-3xl font-bold scroll-m-20 border-b pb-2"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="mt-7 mb-3 text-2xl font-bold scroll-m-20 border-b pb-1.5 first:mt-0"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="mt-6 mb-2 text-xl font-bold scroll-m-20"
                    {...props}
                  />
                ),
                h4: ({ node, ...props }) => (
                  <h4
                    className="mt-5 mb-2 text-lg font-bold scroll-m-20"
                    {...props}
                  />
                ),
                h5: ({ node, ...props }) => (
                  <h5 className="mt-4 mb-2 text-base font-bold" {...props} />
                ),
                h6: ({ node, ...props }) => (
                  <h6 className="mt-4 mb-2 text-sm font-bold" {...props} />
                ),

                // Paragraphs
                p: ({ node, ...props }) => (
                  <p className="leading-7 my-4 first:mt-0" {...props} />
                ),

                // Links
                a: ({ node, ...props }) => (
                  <a
                    className="font-medium text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),

                // Emphasis (bold)
                strong: ({ node, ...props }) => (
                  <strong className="font-bold" {...props} />
                ),

                // Emphasis (italic)
                em: ({ node, ...props }) => (
                  <em className="italic" {...props} />
                ),

                // Inline code
                code: ({ node, inline, ...props }: any) => {
                  if (inline) {
                    return (
                      <code
                        className="relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground"
                        {...props}
                      />
                    );
                  }
                  // Block code is handled by pre component
                  return <code {...props} />;
                },

                // Code blocks
                pre: ({ node, children, ...props }: any) => {
                  const child =
                    children && Array.isArray(children)
                      ? children[0]
                      : children;
                  const isCodeElement =
                    React.isValidElement(child) && child.type === "code";
                  const codeContent = isCodeElement
                    ? (child.props as any).children
                    : children;
                  const className = isCodeElement
                    ? (child.props as any).className
                    : "";

                  // Extract language from className (e.g., "language-tsx" -> "tsx")
                  const languageMatch = className?.match(/language-(\w+)/);
                  const language = languageMatch ? languageMatch[1] : "code";

                  return (
                    <div className="my-6 relative group">
                      <div className="flex items-center justify-between bg-slate-800 rounded-t-lg px-4 py-2 border border-b-0 border-slate-700">
                        <Badge
                          variant="secondary"
                          className="bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs"
                        >
                          {language}
                        </Badge>
                        <span className="text-xs text-slate-400">code</span>
                      </div>
                      <pre className="overflow-x-auto bg-slate-900 rounded-b-lg p-4 border border-slate-700 text-sm leading-relaxed">
                        {codeContent}
                      </pre>
                    </div>
                  );
                },

                // Lists
                ul: ({ node, ...props }) => (
                  <ul className="my-4 ml-6 list-disc space-y-2" {...props} />
                ),

                ol: ({ node, ...props }) => (
                  <ol className="my-4 ml-6 list-decimal space-y-2" {...props} />
                ),

                li: ({ node, ...props }) => (
                  <li className="leading-7" {...props} />
                ),

                // Blockquote
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="my-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950 p-4 italic text-blue-900 dark:text-blue-100 rounded"
                    {...props}
                  />
                ),

                // Horizontal rule
                hr: ({ node, ...props }) => (
                  <hr
                    className="my-6 border-t border-slate-300 dark:border-slate-700"
                    {...props}
                  />
                ),

                // Tables
                table: ({ node, ...props }) => (
                  <div className="my-6 overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-lg">
                    <table className="min-w-full text-sm" {...props} />
                  </div>
                ),

                thead: ({ node, ...props }) => (
                  <thead
                    className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700"
                    {...props}
                  />
                ),

                tbody: ({ node, ...props }) => (
                  <tbody
                    className="divide-y divide-slate-300 dark:divide-slate-700"
                    {...props}
                  />
                ),

                tr: ({ node, ...props }) => (
                  <tr
                    className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    {...props}
                  />
                ),

                th: ({ node, ...props }) => (
                  <th
                    className="px-4 py-2 text-left font-semibold text-slate-900 dark:text-slate-50"
                    {...props}
                  />
                ),

                td: ({ node, ...props }) => (
                  <td
                    className="px-4 py-2 text-slate-700 dark:text-slate-300"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
