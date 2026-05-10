"use client";

import { Card } from "@/shared/components/card/Card";
import { Pagination } from "@/shared/components/pagination/Pagination";

import { usePostList } from "./usePostList";

export function PostListContent() {
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
