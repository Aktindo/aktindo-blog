import "tailwindcss/tailwind.css";
import "../styles/global.css";
import "highlight.js/styles/atom-one-dark.css";

import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";

import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { Loader } from "../components";

export interface Post {
  id: string;
  title: string;
  contentHtml?: string;
  date: string;
  imageURL?: string;
  categories: string;
  description: string;
}

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set(
        {
          email: user.email,
          username: user.displayName,
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return <Loader />;

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
