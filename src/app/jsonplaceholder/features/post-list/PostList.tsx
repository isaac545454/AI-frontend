"use client";

import { Card } from "@/shared/components/card/Card";
import { CardGridSkeleton } from "@/shared/components/card-grid-skeleton/CardGridSkeleton";
import { Pagination } from "@/shared/components/pagination/Pagination";

import { usePostList } from "./usePostList";

export function PostList() {
  const {
    posts,
    isPending,
    isError,
    errorMessage,
    page,
    totalPages,
    handlePageChange,
    skeletonCount,
    skeletonShowFooter,
  } = usePostList();

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

      {isPending ? (
        <CardGridSkeleton count={skeletonCount} showFooter={skeletonShowFooter} />
      ) : null}
      {isError ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {posts ? (
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
      ) : null}

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
