import { Avatar, AvatarGroup, useToast } from "@chakra-ui/react";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import firebase from "firebase";
import { Data } from "react-firebase-hooks/firestore/dist/firestore/types";
import { Post } from "../../pages/_app";

export interface PostLikesProps {
  user: firebase.User;
  postSnapshot: Data<firebase.firestore.DocumentData, "", "">;
  postRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  postData: Post;
}

const PostLikes: React.FC<PostLikesProps> = ({
  user,
  postSnapshot,
  postRef,
  postData,
}) => {
  const toast = useToast();

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

  return (
    <div className="mt-5 flex">
      <div className="flex items-center">
        <button
          className={`btn btn-sm ${
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
                duration: 5 * 1000,
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
              duration: 5 * 1000,
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
  );
};

export { PostLikes };
