"use client";

import { useQueryClient } from "@next-modular-arch/query/useQueryClient";
import { Suspense, useState } from "react";

import { CardGridSkeleton } from "@next-modular-arch/ui-data/card-grid-skeleton/CardGridSkeleton";
import { ErrorBoundary } from "@next-modular-arch/ui-errors/ErrorBoundary";

import { postListConfig } from "../services/postListConfig";
import { PostListContent } from "./PostListContent";
import { PostListErrorFallback } from "./PostListErrorFallback";

export function PostList() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

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

      <ErrorBoundary
        onReset={() => {
          void queryClient.resetQueries({
            queryKey: ["jsonplaceholder", "posts"],
          });
        }}
        FallbackComponent={PostListErrorFallback}
      >
        <Suspense
          fallback={
            <CardGridSkeleton
              count={postListConfig.pageSize}
              showFooter
            />
          }
        >
          <PostListContent page={page} onPageChange={setPage} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
