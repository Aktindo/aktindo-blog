import Image from "next/image";
import React from "react";
import { Post } from "../../pages/_app";

export interface PostHeaderProps {
  postData: Post;
}

const PostHeader: React.SFC<PostHeaderProps> = ({ postData }) => {
  const getReadingTime = (str) => {
    const words = str.split(" ");
    const minutes = Math.ceil(words.length / 200);
    return `${minutes} min read`;
  };

  return (
    <div className="post-header grid mx-5">
      <p className="post-header__title text-2xl md:text-4xl lg:text-5xl font-poppins font-semibold">
        {postData.title}
      </p>
      <p className="post-header__description text-lg md:text-xl">
        {postData.description}
      </p>
      <div className="post-header__author flex items-center mt-5">
        <div className="post-header__author-avatar avatar">
          <div className="rounded-full w-10 h-10 md:w-12 md:h-12 ring ring-primary">
            <Image
              src="/logos/Aktindo.svg"
              alt="Aktindo's Avatar"
              width={48}
              height={48}
            />
          </div>
        </div>
        <div className="post-header__author-info ml-3">
          <p className="text-primary">Aktindo</p>
          <p className="text-gray-600 text-sm">
            Posted on {postData.date} • {getReadingTime(postData.contentHtml)}
          </p>
        </div>
      </div>
    </div>
  );
};

export { PostHeader };
