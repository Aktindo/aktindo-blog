import React from "react";
import { Post } from "../../pages/_app";
import { BlogPost } from "..";

export interface BlogPostsProps {
  posts: Post[];
}

const BlogPosts: React.FC<BlogPostsProps> = ({ posts }) => {
  return (
    <div className="blogs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-10 mb-10">
      {posts.map((post, index) => (
        <BlogPost key={index} post={post} />
      ))}
    </div>
  );
};

export { BlogPosts };
