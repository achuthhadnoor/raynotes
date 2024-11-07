import React, { ReactNode, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This s" }: Props) => {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.code === "Equal" || event.code === "Minus") &&
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div>
      <header className="flex justify-between px-2 items-center py-1 dragable">
        <div className="flex flex-row ">
          <div className="relative flex gap-2 left-[5px] opacity-[0.3] transition ease-in-out text-neutral-700 dark:text-neutral-300">
            <svg
              width="56"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="5.5" stroke="currentColor"></circle>
              <circle cx="28" cy="8" r="5.5" stroke="currentColor"></circle>
              <circle cx="48" cy="8" r="5.5" stroke="currentColor"></circle>
            </svg>
          </div>
        </div>
        <div className=" text-center text-xs">{title}</div>
        <div className=" text-right flex">
          <div className="p-1">⌘</div>
          <div className="p-1">+</div>
          <div className="p-1">🧷</div>
        </div>
      </header>
      {/* <nav>
        <Link href="/">Home</Link> | <Link href="/about">About</Link> |{" "}
        <Link href="/initial-props">With Initial Props</Link>
      </nav> */}
      {children}
    </div>
  );
};

export default Layout;
