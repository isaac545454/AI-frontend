"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Card } from "@/shared/components/card/Card";
import { Pagination } from "@/shared/components/pagination/Pagination";

import {
  listPosts,
  postCoverImageUrl,
  POSTS_PAGE_SIZE,
  POSTS_TOTAL,
} from "./services/postService";

const totalPages = Math.max(1, Math.ceil(POSTS_TOTAL / POSTS_PAGE_SIZE));

export function PostList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["jsonplaceholder", "posts", page],
    queryFn: () => listPosts(page),
  });

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
        <p className="text-sm text-[var(--color-muted)]">Carregando…</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error instanceof Error ? error.message : "Erro ao carregar posts."}
        </p>
      ) : null}

      {data ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((post) => (
            <li key={post.id}>
              <Card
                imageSrc={postCoverImageUrl(post.id)}
                imageAlt={`Capa ilustrativa do post ${post.id}`}
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
