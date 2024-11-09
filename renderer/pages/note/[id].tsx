// import { NextPageContext } from 'next'
import Layout from "../../components/Layout";
import { User } from "../../interfaces";
import { findAll, findData } from "../../utils/sample-api";
// import ListDetail from "../../components/ListDetail";
import { GetStaticPaths, GetStaticProps } from "next";
import Editor from "../../components/Editor";
import { createRef, useEffect } from "react";

type Params = {
  id?: string;
};

type Props = {
  item?: User;
  errors?: string;
};

const Note = ({ item, errors }: Props) => {
  const wrapperRef = createRef<HTMLDivElement>();

  if (errors) {
    return (
      <Layout title={`Error | Next.js + TypeScript + Electron Example`}>
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const { height } = wrapperRef.current.getBoundingClientRect();
        console.log('====================================');
        console.log(height);
        console.log('====================================');
        window.electron.ipcRenderer.invoke("auto-height", height);
      }
    };

    const observer = new ResizeObserver(handleResize);
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      if (wrapperRef.current) {
        observer.unobserve(wrapperRef.current);
      }
    };
  }, [wrapperRef]);


  return (
    <Layout>
      <div className="group" ref={wrapperRef}>
        <header className="flex justify-between px-2 items-center py-1 dragable opacity-[0.3] group-hover:opacity-[1] transition ease-in-out text-neutral-600">
          <div className="flex flex-row ">
            <div className="relative flex gap-2 left-[5px] ">
              <svg
                width="56"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="6" fill="currentColor"></circle>
                <circle cx="28" cy="8" r="6" fill="currentColor"></circle>
                <circle cx="48" cy="8" r="6" fill="currentColor"></circle>
              </svg>
            </div>
          </div>
          <div className=" transition ease-in-out text-neutral-600/80 text-sm">
            untitled
          </div>
          <div className="flex gap-2">
            <span className="p-1">⌘</span>
            <span className="p-1">+</span>
          </div>
        </header>
        <div contentEditable className="text-sm outline-none p-4 accent-green-600 caret-green-600 selection:bg-green-600/20">
          Start Typing...
        </div>
        <div className="text-center text-sm  opacity-[0.3] group-hover:opacity-[1] transition ease-in-out text-neutral-600">12 characters</div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const items: User[] = await findAll();
  const paths = items.map((item) => `/note/${item.id}`);
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as Params;

  try {
    const item = await findData(Array.isArray(id) ? id[0] : id);
    return {
      props: {
        item,
      },
    };
  } catch (err) {
    return {
      props: {
        errors: err.message,
      },
    };
  }
};

export default Note;
