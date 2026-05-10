"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import { CardGridSkeleton } from "@/shared/components/card-grid-skeleton/CardGridSkeleton";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";

import { postListConfig } from "../../services/postListConfig";

import { PostListContent } from "./PostListContent";
import { PostListErrorFallback } from "./PostListErrorFallback";

export function PostList() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
          JSONPlaceholder — Posts
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Listagem paginada via{" "}
          <span className="font-mono text-xs">jsonplaceholder.typicode.com</span>
          ; imagens estáticas (Picsum) por ID do post.
        </p>
      </header>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={PostListErrorFallback}>
            <Suspense
              fallback={
                <CardGridSkeleton
                  count={postListConfig.pageSize}
                  showFooter
                />
              }
            >
              <PostListContent />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}
