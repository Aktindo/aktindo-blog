import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navigateToPage } from "../../lib/helpers/index";
import { useRouter } from "next/dist/client/router";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginModal } from "..";
import { toast, useDisclosure, useToast } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { LogoutIcon } from "@heroicons/react/outline";

export interface HeaderProps {}
export interface HeaderItem {
  label: string;
  href: string;
  target?: string;
}

export const headerItems: HeaderItem[] = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "https://aktindo.me/", target: "_blank" },
];

const Header: React.FC<HeaderProps> = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="navbar bg-primary text-gray-200 shadow-lg mb-16 py-3 px-5 w-full font-inter">
      <div className="navigation">
        <div className="dropdown mr-3 lg:hidden">
          <div tabIndex={0} className="m-1 btn btn-ghost">
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </div>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content bg-base-100 text-base-content rounded-box w-52"
          >
            {headerItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <a target={item.target || ""}>{item.label}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Image
          src="/logos/Aktindo.svg"
          alt="Aktindo's Logo"
          width={50}
          height={50}
          className="navigation__logo cursor-pointer"
          onClick={() => navigateToPage(router, "/")}
        />
      </div>
      <div className="px-2 mx-2 hidden lg:block">
        <div className="flex items-stretch">
          {headerItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <a target={item.target || ""} className="btn btn-ghost">
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-2 mx-2 ml-auto">
        <div className="flex items-stretch">
          {!user ? (
            <a onClick={onOpen} className="btn btn-ghost">
              LogIn
            </a>
          ) : (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost flex items-center">
                <div className="avatar mr-2">
                  <div className="rounded-full w-10 h-10">
                    <img src={user.photoURL} alt={`${user.email}'s Avatar`} />
                  </div>
                </div>
                {user.displayName}
              </div>
              <ul
                tabIndex={0}
                className="p-2 shadow text-base-content menu dropdown-content bg-base-100 rounded-box w-52"
              >
                <li
                  onClick={() =>
                    auth.signOut().then(() =>
                      toast({
                        title: "Logged out successfully.",
                        status: "success",
                        duration: 10 * 1000,
                        isClosable: true,
                        position: "top",
                      })
                    )
                  }
                >
                  <a>
                    <LogoutIcon className="w-5 h-5 mr-1" />
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
        <LoginModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
      </div>
    </div>
  );
};

export { Header };
