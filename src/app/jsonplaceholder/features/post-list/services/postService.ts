import { httpClient } from "@/shared/lib/http/httpClient";

const BASE = "https://jsonplaceholder.typicode.com";

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

/** JSONPlaceholder expõe 100 posts no total. */
export const POSTS_TOTAL = 100;

export const POSTS_PAGE_SIZE = 10;

export async function listPosts(page: number): Promise<Post[]> {
  const { data } = await httpClient.get<Post[]>(`${BASE}/posts`, {
    params: { _page: page, _limit: POSTS_PAGE_SIZE },
  });
  return data;
}

export function postCoverImageUrl(postId: number): string {
  return `https://picsum.photos/seed/jsonplaceholder-${postId}/600/375`;
}
