import { Color } from "@tiptap/extension-color";
import { ListItem } from "@tiptap/extension-list-item";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import React from "react";
import {
  GoBold,
  GoItalic,
  GoStrikethrough,
  GoCode,
  GoLink,
  GoTasklist,
  GoListOrdered,
  GoHorizontalRule,
  GoHeading,
} from "react-icons/go";
import { TbBlockquote } from "react-icons/tb";
import { MdOutlineFormatUnderlined, MdList } from "react-icons/md";
import { PiCodeBlockBold } from "react-icons/pi";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className=" flex gap-2 flex-wrap my-2px-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active bg-neutral-600" : ""}
      >
        <GoBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active bg-neutral-600" : ""}
      >
        <GoItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active bg-neutral-600" : ""}
      >
        <GoStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active bg-neutral-600" : ""}
      >
        <GoCode />
      </button>
      <select
        onChange={(e) =>
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6,
            })
            .run()
        }
        value={
          editor.isActive("heading", { level: 1 })
            ? "1"
            : editor.isActive("heading", { level: 2 })
            ? "2"
            : editor.isActive("heading", { level: 3 })
            ? "3"
            : editor.isActive("heading", { level: 4 })
            ? "4"
            : editor.isActive("heading", { level: 5 })
            ? "5"
            : editor.isActive("heading", { level: 6 })
            ? "6"
            : ""
        }
        className="border-none bg-transparent"
      >
        <option value="" disabled>
          H
        </option>
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
        <option value="4">H4</option>
        <option value="5">H5</option>
        <option value="6">H6</option>
      </select>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList") ? "is-active bg-neutral-600" : ""
        }
      >
        <MdList />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList") ? "is-active bg-neutral-600" : ""
        }
      >
        <GoListOrdered />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={
          editor.isActive("codeBlock") ? "is-active bg-neutral-600" : ""
        }
      >
        <PiCodeBlockBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote") ? "is-active bg-neutral-600" : ""
        }
      >
        <TbBlockquote />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <GoHorizontalRule />
      </button>
      <button
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={
          editor.isActive("textStyle", { color: "#958DF1" })
            ? "is-active bg-neutral-600"
            : ""
        }
      >
        Purple
      </button>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  StarterKit.configure({
    paragraph: {
      HTMLAttributes: {
        class: "m-4 p-4 border border-gray-300 rounded",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc flex ",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal ",
      },
    },
  }),
];

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

const Editor = () => {
  return (
    <div className="">
      <EditorProvider
        slotAfter={<MenuBar />}
        extensions={extensions}
        content={content}
      ></EditorProvider>
    </div>
  );
};
export default Editor;
