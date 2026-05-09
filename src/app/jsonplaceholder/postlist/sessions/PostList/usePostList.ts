"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { mapPostListRows } from "../../map/mapPostListRows";
import { postListConfig } from "../../services/postListConfig";
import { listPosts } from "../../services/postService";

const totalPages = Math.max(
  1,
  Math.ceil(postListConfig.totalPosts / postListConfig.pageSize),
);

export function usePostList() {
  const [page, setPage] = useState(1);

  const { data: posts } = useSuspenseQuery({
    queryKey: ["jsonplaceholder", "posts", page],
    queryFn: () => listPosts(page),
    select: mapPostListRows,
  });

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  return {
    posts,
    page,
    totalPages,
    handlePageChange,
  };
}
