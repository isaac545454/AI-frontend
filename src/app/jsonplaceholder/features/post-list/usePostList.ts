"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import {
  listPosts,
  postCoverImageUrl,
  POSTS_PAGE_SIZE,
  POSTS_TOTAL,
} from "./services/postService";

const totalPages = Math.max(1, Math.ceil(POSTS_TOTAL / POSTS_PAGE_SIZE));

export function usePostList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["jsonplaceholder", "posts", page],
    queryFn: () => listPosts(page),
  });

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const errorMessage =
    error instanceof Error ? error.message : "Erro ao carregar posts.";

  const posts =
    data?.map((post) => ({
      ...post,
      coverImageSrc: postCoverImageUrl(post.id),
      coverImageAlt: `Capa ilustrativa do post ${post.id}`,
    })) ?? null;

  return {
    posts,
    isPending,
    isError,
    errorMessage,
    page,
    totalPages,
    handlePageChange,
    skeletonCount: POSTS_PAGE_SIZE,
    skeletonShowFooter: true,
  };
}
