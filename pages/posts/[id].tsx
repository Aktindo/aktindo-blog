import React, { useState } from "react";
import { Footer, Header, PostHeader } from "../../components";
import {
  ThumbDownIcon,
  ThumbUpIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { Post as PostI } from "../_app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { Avatar, AvatarGroup, useToast } from "@chakra-ui/react";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getAllPostIds, getPostData } from "../../lib/posts";
import { useDocumentMetaData } from "../../lib/hooks";

dayjs.extend(relativeTime);

export interface PostProps {
  postData: PostI;
  postDataDb: firebase.firestore.DocumentData;
}

const Post: React.FC<PostProps> = ({ postData }) => {
  const [user] = useAuthState(auth);
  const [comment, setComment] = useState("");
  const postRef = db.collection("posts").doc(postData.id);
  const commentsRef = postRef.collection("comments");
  const [postSnapshot] = useDocumentData(postRef);
  const [commentsSnapshot] = useCollection(
    commentsRef.orderBy("postedOn", "desc")
  );

  const likePost = () => {
    postRef?.set(
      {
        usersLiked: firebase.firestore.FieldValue.arrayUnion({
          id: user?.uid,
          name: user?.displayName,
          photoURL: user?.photoURL,
        }),
      },
      { merge: true }
    );
  };

  const unlikePost = () => {
    postRef?.set(
      {
        usersLiked: firebase.firestore.FieldValue.arrayRemove({
          id: user?.uid,
          name: user?.displayName,
          photoURL: user?.photoURL,
        }),
      },
      { merge: true }
    );
  };

  const likeComment = (commentId) => {
    commentsRef?.doc(commentId).set(
      {
        likes: firebase.firestore.FieldValue.arrayUnion(user?.uid),
        dislikes: firebase.firestore.FieldValue.arrayRemove(user?.uid),
      },
      { merge: true }
    );
  };

  const unlikeComment = (commentId: string) => {
    commentsRef?.doc(commentId).set(
      {
        likes: firebase.firestore.FieldValue.arrayRemove(user?.uid),
        dislikes: firebase.firestore.FieldValue.arrayRemove(user?.uid),
      },
      { merge: true }
    );
  };

  const dislikeComment = (commentId: string) => {
    commentsRef?.doc(commentId).set(
      {
        likes: firebase.firestore.FieldValue.arrayRemove(user?.uid),
        dislikes: firebase.firestore.FieldValue.arrayUnion(user?.uid),
      },
      { merge: true }
    );
  };

  const removeComment = (commentId: string) => {
    commentsRef?.doc(commentId).delete();
  };

  const postComment = () => {
    postRef?.collection("comments").add({
      comment,
      user: {
        id: user?.uid,
        name: user?.displayName,
        photoURL: user?.photoURL,
      },
      postedOn: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  const toast = useToast();

  return (
    <section
      className={`${postData.title} flex flex-col min-h-screen font-inter`}
    >
      {useDocumentMetaData(postData.title, postData.description)}
      <Header />
      <div className="mx-10 md:mx-auto">
        <PostHeader postData={postData} />

        <article className="prose lg:prose-lg">
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
        <div>
          {postData.categories.split(",").map((category) => (
            <div className="badge font-bold badge-info rounded uppercase ml-1">
              {category}
            </div>
          ))}
        </div>
        <div className="mt-5 flex">
          <div className="flex items-center">
            <button
              className={`btn btn-sm text-gray-600${
                postSnapshot?.usersLiked?.find(
                  (userLiked) => userLiked?.id === user?.uid
                )
                  ? " btn-primary btn-outline"
                  : " btn-ghost"
              }`}
              onClick={() => {
                if (!user) {
                  return toast({
                    title: "Uh oh! You must be logged in to like posts.",
                    status: "error",
                    duration: 10 * 1000,
                    isClosable: true,
                    position: "top",
                  });
                }

                if (
                  postSnapshot?.usersLiked?.find(
                    (userLiked) => userLiked?.id === user?.uid
                  )
                ) {
                  console.log("e");
                  unlikePost();
                  return;
                }

                likePost();
                return toast({
                  title: "Added to liked posts.",
                  status: "success",
                  duration: 10 * 1000,
                  isClosable: true,
                  position: "top",
                });
              }}
            >
              <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
              {postSnapshot?.usersLiked?.length ?? 0}
            </button>
            <AvatarGroup size="md" max={3} mx={2}>
              {postSnapshot?.usersLiked?.map((user) => (
                <Avatar
                  key={user?.id}
                  size="md"
                  src={user?.photoURL}
                  name={user?.name}
                />
              ))}
            </AvatarGroup>
          </div>

          <div className="ml-auto my-auto">
            <a
              target="_blank"
              rel="_noreferrer"
              href={`https://twitter.com/intent/tweet?text=${postData.title} - https://blog.aktindo.com/posts/${postData.id}`}
            >
              <FontAwesomeIcon icon={faTwitter} className="text-gray-500 w-5" />
            </a>
          </div>
        </div>
        <div className="divider"></div>
        <div>
          <div>
            <div>
              <p className="text-xl font-poppins font-bold">
                {commentsSnapshot?.docs?.length} Comments{" "}
                <span className="text-sm text-gray-600">
                  (login to post a comment)
                </span>
              </p>
              {user && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">What are your thoughts?</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Start writing..."
                      className="w-full pr-16 input input-primary input-bordered"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      className="absolute top-0 right-0 rounded-l-none btn btn-primary"
                      onClick={postComment}
                    >
                      POST
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="comments mt-5">
              {commentsSnapshot?.docs?.map((doc) => {
                const commentData = doc.data();

                return (
                  <div className="comment flex bg-base-200 px-2 py-4 my-2 rounded-box max-w-prose">
                    <div className="avatar">
                      <div className="rounded-full w-10 h-10 ring ring-primary ring-offset-2 mx-2">
                        <img
                          src={commentData?.user.photoURL}
                          alt={`${commentData?.user.name}'s Avatar`}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="ml-1">
                        <div className="flex">
                          <p className="font-medium flex w-full">
                            <span>{commentData?.user.name}</span>
                            <span className="ml-1 text-sm mt-0.5 text-gray-600">
                              {dayjs(commentData?.postedOn?.toDate()).fromNow()}
                            </span>
                          </p>
                        </div>
                        <p className="break-all ">{commentData?.comment}</p>
                      </div>
                      <div className="mt-1 flex">
                        <div className="flex items-center">
                          <button
                            className={`btn btn-sm px-1${
                              commentData?.likes?.includes(user?.uid)
                                ? " btn-primary btn-outline"
                                : " btn-ghost"
                            }`}
                            onClick={() => {
                              if (!user) {
                                return toast({
                                  title:
                                    "Uh oh! You must be logged in to like comments.",
                                  status: "error",
                                  duration: 10 * 1000,
                                  isClosable: true,
                                  position: "top",
                                });
                              }

                              if (commentData?.likes?.includes(user.uid)) {
                                unlikeComment(doc.id);
                                return;
                              }

                              likeComment(doc.id);
                              return toast({
                                title: "You liked this comment.",
                                status: "success",
                                duration: 10 * 1000,
                                isClosable: true,
                                position: "top",
                              });
                            }}
                          >
                            <ThumbUpIcon className="w-5 h-5" />{" "}
                            {commentData?.likes?.length || 0}
                          </button>
                        </div>
                        <button
                          className={`btn btn-sm btn-circle ml-1 px-1${
                            commentData?.dislikes?.includes(user?.uid)
                              ? " btn-primary btn-outline"
                              : " btn-ghost"
                          }`}
                          onClick={() => {
                            if (!user) {
                              return toast({
                                title:
                                  "Uh oh! You must be logged in to dislike comments.",
                                status: "error",
                                duration: 10 * 1000,
                                isClosable: true,
                                position: "top",
                              });
                            }

                            if (commentData?.dislikes?.includes(user?.uid)) {
                              unlikeComment(doc.id);
                              return;
                            }

                            dislikeComment(doc.id);
                            return toast({
                              title: "You disliked this comment.",
                              status: "success",
                              duration: 10 * 1000,
                              isClosable: true,
                              position: "top",
                            });
                          }}
                        >
                          <ThumbDownIcon className="w-5 h-5" />
                        </button>
                        {user?.uid == commentData?.user.id && (
                          <button
                            className="btn btn-sm btn-ghost btn-circle ml-2"
                            onClick={() => removeComment(doc.id)}
                          >
                            <TrashIcon className="w-5 h-5 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Post;

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
}
