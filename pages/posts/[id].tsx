import React, { useState } from "react";
import {
  Footer,
  Header,
  PostHeader,
  Divider,
  PostLikes,
} from "../../components";
import {
  ReplyIcon,
  ThumbDownIcon,
  ThumbUpIcon,
  TrashIcon,
  XIcon,
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [reply, setReply] = useState<string>("");
  const [repliesVisible, setRepliesVisible] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const postRef = db.collection("posts").doc(postData.id);
  const commentsRef = postRef.collection("comments");
  const [postSnapshot] = useDocumentData(postRef);
  const [commentsSnapshot] = useCollection(
    commentsRef.orderBy("postedOn", "desc")
  );

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

  const postReply = (commentId: string) => {
    commentsRef?.doc(commentId).set(
      {
        replies: firebase.firestore.FieldValue.arrayUnion({
          comment: reply,
          user: {
            id: user?.uid,
            name: user?.displayName,
            photoURL: user?.photoURL,
          },
          postedOn: firebase.firestore.Timestamp.now(),
        }),
      },
      { merge: true }
    );

    setReply("");
    setRepliesVisible(null);
  };

  const toast = useToast();

  return (
    <section
      className={`${postData.title} flex flex-col min-h-screen font-inter bg-base-100 text-base-content`}
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
        <PostLikes
          user={user}
          postData={postData}
          postSnapshot={postSnapshot}
          postRef={postRef}
        />
        <Divider />
        <div>
          <div>
            <div>
              <p className="text-xl font-poppins font-bold">
                {commentsSnapshot?.docs?.length} Comments{" "}
                {!user && (
                  <span className="text-sm text-gray-600 font-medium dark:text-gray-300">
                    (login to post a comment)
                  </span>
                )}
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
                  <>
                    <div className="comment flex bg-base-200 px-2 py-4 my-2 rounded-box max-w-prose">
                      <div className="avatar">
                        <div className="rounded-full w-10 h-10 ring ring-primary ring-offset-2 dark:ring-offset-0 mx-2">
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
                              <span className="ml-1 text-sm mt-0.5 text-gray-600 dark:text-gray-300">
                                {dayjs(
                                  commentData?.postedOn?.toDate()
                                ).fromNow()}
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
                                    duration: 5 * 1000,
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
                                  duration: 5 * 1000,
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
                              if (!user)
                                return toast({
                                  title:
                                    "Uh oh! You must be logged in to dislike comments.",
                                  status: "error",
                                  duration: 5 * 1000,
                                  isClosable: true,
                                  position: "top",
                                });

                              if (commentData?.dislikes?.includes(user?.uid))
                                return unlikeComment(doc.id);

                              dislikeComment(doc.id);
                              return toast({
                                title: "You disliked this comment.",
                                status: "success",
                                duration: 5 * 1000,
                                isClosable: true,
                                position: "top",
                              });
                            }}
                          >
                            <ThumbDownIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="btn btn-sm btn-circle btn-ghost ml-2"
                            onClick={() => {
                              if (!user) {
                                setReplyingTo(null);
                                return toast({
                                  title:
                                    "Uh oh! You must be logged in to reply to comments.",
                                  status: "error",
                                  duration: 5 * 1000,
                                  isClosable: true,
                                  position: "top",
                                });
                              }

                              setReplyingTo(commentData?.user.id);
                            }}
                          >
                            <ReplyIcon className="w-5 h-5" />
                          </button>
                          {user?.uid == commentData?.user.id && (
                            <button
                              className="btn btn-sm btn-ghost btn-circle"
                              onClick={() => removeComment(doc.id)}
                            >
                              <TrashIcon className="w-5 h-5 text-red-500" />
                            </button>
                          )}
                        </div>
                        {replyingTo === commentData?.user.id && (
                          <div className="form-control w-full pr-5">
                            <label className="label">
                              <span className="label-text flex items-center">
                                Replying to {commentData?.user.name}
                              </span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Start writing..."
                                className="w-full pr-16 input input-primary input-bordered"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                              />
                              <button
                                className="absolute top-0 right-0 rounded-l-none btn btn-primary"
                                onClick={() => {
                                  postReply(doc.id);
                                  setReplyingTo(null);
                                }}
                              >
                                POST
                              </button>
                            </div>
                          </div>
                        )}
                        {commentData?.replies?.length && (
                          <button
                            className="mt-2 btn btn-sm btn-ghost"
                            onClick={() =>
                              !repliesVisible
                                ? setRepliesVisible(doc.id)
                                : setRepliesVisible(null)
                            }
                          >
                            {repliesVisible?.length
                              ? repliesVisible === doc.id
                                ? "Hide"
                                : "View"
                              : "View"}{" "}
                            {commentData?.replies?.length} replies
                          </button>
                        )}
                        <div className="replies mt-2">
                          {commentData?.replies?.length > 0 &&
                            repliesVisible === doc.id &&
                            commentData?.replies.map((reply) => (
                              <div className="mt-2">
                                <div className="flex">
                                  <img
                                    src={reply.user.photoURL}
                                    alt={`${reply.user.name}'s Avatar`}
                                    className="w-8 h-8 rounded-full mr-1"
                                  />
                                  <div className="ml-1">
                                    <p className="font-medium flex w-full">
                                      <span>{reply.user.name}</span>
                                      <span className="ml-1 text-sm mt-0.5 text-gray-600 dark:text-gray-300">
                                        {dayjs(
                                          reply.postedOn.toDate()
                                        ).fromNow()}
                                      </span>
                                    </p>
                                    <p className="break-all">{reply.comment}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
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
