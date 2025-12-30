"use client";

import { capitalize } from "@/app/lib/common-utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import navbarLogo from "@/public/navbar-logo.png";
import { useUser } from "@auth0/nextjs-auth0";

export default function NavBar() {
  const [expandProfile, setExpandProfile] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const getProfileClassName = () => {
    if (!expandProfile) {
      return "hidden";
    }
    return "absolute right-2 md:right-8 top-13 block bg-zinc-500 p-2 rounded-md";
  };

  return (
    <nav className="absolute top-0 w-[100vw]">
      <div className="flex justify-between mt-5 dark:text-white dark:bg-black">
        <div className="md:ml-10">
          <Link href="/" aria-label="Logout" role="link">
            <Image
              src={navbarLogo}
              alt="Home page logo"
              width={100}
              height={100}
            />
          </Link>
        </div>
        <div className="flex gap-10 md:gap-20">
          <div className="cursor-pointer">
            {pathname === "/history" ? (
              <Link aria-label="Go to Home page" role="link" href="/">
                Home
              </Link>
            ) : (
              <Link aria-label="Go to History page" role="link" href="/history">
                History
              </Link>
            )}
          </div>
          {user ? (
            <div className="cursor-pointer md:mr-10">
              <div
                className="flex items-center gap-2"
                onClick={() =>
                  setExpandProfile((expandProfile) => !expandProfile)
                }
                aria-label="User profile"
              >
                {user.nickname ? capitalize(user.nickname) : "User"}{" "}
                {expandProfile ? (
                  <ChevronUp size={18} role="presentation" />
                ) : (
                  <ChevronDown size={18} role="presentation" />
                )}
              </div>
              <div className={getProfileClassName()}>
                <Link href="/auth/logout" aria-label="Logout" role="link">
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            <div className="cursor-pointe md:mr-10">
              <Link href="/auth/login" aria-label="Login" role="link">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
