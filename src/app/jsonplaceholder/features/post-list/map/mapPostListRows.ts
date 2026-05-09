import { postCoverImageUrl, type Post } from "../services/postService";

export type PostListRowDto = Post & {
  coverImageSrc: string;
  coverImageAlt: string;
};

export function mapPostListRows(posts: Post[]): PostListRowDto[] {
  return posts.map((post) => ({
    ...post,
    coverImageSrc: postCoverImageUrl(post.id),
    coverImageAlt: `Capa ilustrativa do post ${post.id}`,
  }));
}
