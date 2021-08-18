import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

export interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="text-gray-600 dark:text-gray-300 body-font mt-auto">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <a className="flex title-font font-medium items-center md:justify-start justify-center dark:text-gray-200 text-gray-900">
          <Image
            src="/logos/Aktindo.svg"
            alt="Aktindo's Logo"
            width={50}
            height={50}
          />
          <span className="ml-3 text-xl">Aktindo Inc.</span>
        </a>
        <p className="text-sm text-gray-500 dark:text-gray-300 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 dark:border-gray-600 sm:py-2 sm:mt-0 mt-4">
          © 2020 - {new Date().getFullYear()} Aktindo Inc. —
          <a
            href="https://twitter.com/aktindo"
            className="text-gray-600 dark:text-gray-300 ml-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            @aktindo
          </a>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          Blog made with{" "}
          <FontAwesomeIcon className="text-red-500 m-1" icon={faHeart} /> by
          Aktindo
        </span>
      </div>
    </footer>
  );
};

export { Footer };
