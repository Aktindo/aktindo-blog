import { getSortedPostsData } from "../lib/posts";
import Image from "next/image";
import { FC, useState } from "react";
import { Post } from "./_app";
import {
  Header,
  Divider,
  BlogCategories,
  BlogPosts,
  Footer,
} from "../components";
import { useDocumentMetaData } from "../lib/hooks";

export interface HomeProps {
  allPostsData: Post[];
  blogCategories: string[];
}

export const Home: FC<HomeProps> = ({ allPostsData, blogCategories }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <section className="home flex flex-col min-h-screen font-inter">
      {useDocumentMetaData("Home", "A place where I post my blogs.")}
      <Header />
      <div className="header grid justify-center text-center my-10">
        <Image
          src="/logos/Aktindo.svg"
          alt="Aktindo's Logo"
          width={150}
          height={150}
          className="header__logo"
        />
        <div className="header__heading mt-2">
          <p className="text-3xl font-bold font-poppins">
            <span className="text-primary">Aktindo</span> Blog
          </p>
          <p className="text-lg font-medium text-gray-600">
            Developing something <span className="text-primary">useless</span>
          </p>
        </div>
      </div>
      <Divider />
      {/* Blog stuff */}
      <BlogCategories
        categories={blogCategories}
        onTabClick={(category) => setActiveCategory(category)}
      />
      <BlogPosts
        posts={
          activeCategory !== "all"
            ? allPostsData.filter((post) =>
                post.categories.split(",").includes(activeCategory)
              )
            : allPostsData
        }
      />

      <Footer />
    </section>
  );
};

export default Home;

export async function getServerSideProps() {
  const allPostsData = getSortedPostsData();

  let blogCategories: string[] = [];
  allPostsData.forEach((post) => {
    if (!blogCategories.find((category) => post.categories === category)) {
      blogCategories = [...blogCategories, ...post.categories.split(",")];
    }
  });

  return {
    props: {
      allPostsData,
      blogCategories,
    },
  };
}
