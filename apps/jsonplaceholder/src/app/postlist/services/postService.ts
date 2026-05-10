import { httpClient } from "@next-modular-arch/http/httpClient";

import { postListConfig } from "./postListConfig";

const BASE = "https://jsonplaceholder.typicode.com";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export async function listPosts(page: number): Promise<Post[]> {
  const { data } = await httpClient.get<Post[]>(`${BASE}/posts`, {
    params: { _page: page, _limit: postListConfig.pageSize },
  });
  return data;
}
