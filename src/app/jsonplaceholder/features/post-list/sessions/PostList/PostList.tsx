"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import { Card } from "@/shared/components/card/Card";
import { CardGridSkeleton } from "@/shared/components/card-grid-skeleton/CardGridSkeleton";
import { ErrorBoundary } from "@/shared/components/error-boundary/ErrorBoundary";
import type { ErrorBoundaryFallbackProps } from "@/shared/components/error-boundary/ErrorBoundary";
import { Pagination } from "@/shared/components/pagination/Pagination";
import { QueryErrorFallback } from "@/shared/components/query-error-fallback/QueryErrorFallback";

import { postListConfig } from "../../services/postListConfig";
import { usePostList } from "./usePostList";

function PostListErrorFallback(props: ErrorBoundaryFallbackProps) {
  return (
    <QueryErrorFallback
      title="Não foi possível carregar os posts."
      {...props}
    />
  );
}

function PostListContent() {
  const { posts, page, totalPages, handlePageChange } = usePostList();

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Card
              imageSrc={post.coverImageSrc}
              imageAlt={post.coverImageAlt}
              title={post.title}
              description={post.body}
              footer={
                <span className="text-xs font-medium text-[var(--color-muted)]">
                  Post #{post.id} · usuário {post.userId}
                </span>
              }
            />
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}

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
