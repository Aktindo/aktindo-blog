import { faCommentAlt, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React from "react";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { navigateToPage } from "../../lib/helpers";
import { Post } from "../../pages/_app";
import { Divider } from "../divider";
import { WanderingCubes } from "better-react-spinkit";

export interface BlogPostProps {
  post: Post;
}

const BlogPost: React.SFC<BlogPostProps> = ({ post }) => {
  const { id, categories, title, description, date, imageURL } = post;
  const router = useRouter();

  const postRef = db.collection("posts").doc(id);
  const commentsRef = postRef.collection("comments");
  const [postSnapshot, postLoading] = useDocumentData(postRef);
  const [commentsSnapshot, commentsLoading] = useCollection(commentsRef);

  return (
    <div
      key={id}
      onClick={() => navigateToPage(router, `/posts/${id}`)}
      className="blog__card bg-base-200 my-2 mx-2 rounded-box shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-3 cursor-pointer focus:ring-primary"
    >
      {imageURL && (
        <div className="blog__card-image">
          <img src={imageURL} alt={title} className="rounded-t-box w-full" />
        </div>
      )}
      <div className="py-2 px-4">
        <div className="blog__card-categories my-1">
          {categories.split(",").map((category, index) => (
            <div
              key={index}
              className="badge badge-sm badge-info rounded uppercase ml-1"
            >
              {category}
            </div>
          ))}
        </div>
        <div className="blog__card-title font-semibold font-poppins text-2xl">
          {title}
        </div>
        <div className="blog__card-description text-gray-600">
          {description}
        </div>
        <div className="blog__card-bottom mt-10 mb-2">
          <div className="flex">
            <div className="blog__card-bottom__buttons justify-start">
              <span className="blog__card-bottom__buttons-link link link-primary link-hover transition duration-300 ease-in-out">
                <Link href={`/posts/${id}`}>Read more</Link>
              </span>
            </div>
            {!postLoading && !commentsLoading ? (
              <div className="blog__card-bottom__stats ml-auto">
                <span className="blog__card-bottom__stats-likes text-gray-600">
                  <FontAwesomeIcon icon={faThumbsUp} />{" "}
                  {postSnapshot?.usersLiked?.length || 0}
                </span>

                <span className="blog__card-bottom__stats-comemnts text-gray-600 ml-5">
                  <FontAwesomeIcon icon={faCommentAlt} />{" "}
                  {commentsSnapshot?.docs?.length}
                </span>
              </div>
            ) : (
              <div className="ml-auto mr-5">
                <WanderingCubes size={20} color="#4297BA" />
              </div>
            )}
          </div>
          <div className="divider"></div>
          <p className="text-sm text-gray-600">Posted on {date}</p>
        </div>
      </div>
    </div>
  );
};

export { BlogPost };
