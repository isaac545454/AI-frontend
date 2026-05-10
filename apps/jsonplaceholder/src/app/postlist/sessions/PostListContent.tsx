"use client";

import { useSuspenseQuery } from "@next-modular-arch/query/useSuspenseQuery";

import { Card } from "@next-modular-arch/ui-data/card/Card";
import { Pagination } from "@next-modular-arch/ui-data/pagination/Pagination";

import { mapPostListRows } from "../map/mapPostListRows";
import { postListConfig } from "../services/postListConfig";
import { listPosts } from "../services/postService";

const totalPages = Math.max(
  1,
  Math.ceil(postListConfig.totalPosts / postListConfig.pageSize),
);

function usePostList(page: number) {
  const { data: posts } = useSuspenseQuery({
    queryKey: ["jsonplaceholder", "posts", page],
    queryFn: () => listPosts(page),
    select: mapPostListRows,
  });

  return {
    posts,
    totalPages,
  };
}

export function PostListContent({
  page,
  onPageChange,
}: {
  page: number;
  onPageChange: (page: number) => void;
}) {
  const { posts, totalPages: pages } = usePostList(page);

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
        totalPages={pages}
        onPageChange={onPageChange}
      />
    </>
  );
}
