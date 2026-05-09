import type { listPosts } from "../services/postService";

type Post = Awaited<ReturnType<typeof listPosts>>[number];

type PostListRowDto = Post & {
  coverImageSrc: string;
  coverImageAlt: string;
};

function postCoverImageUrl(postId: number): string {
  return `https://picsum.photos/seed/jsonplaceholder-${postId}/600/375`;
}

export function mapPostListRows(posts: Post[]): PostListRowDto[] {
  return posts.map((post) => ({
    ...post,
    coverImageSrc: postCoverImageUrl(post.id),
    coverImageAlt: `Capa ilustrativa do post ${post.id}`,
  }));
}
