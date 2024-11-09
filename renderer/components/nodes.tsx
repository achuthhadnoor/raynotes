import React from "react";
import { NodeViewWrapper, ReactNodeViewRenderer, Node } from "@tiptap/react";

const StyledParagraph = (props: any) => {
  return (
    <NodeViewWrapper className="prose prose-lg m-4 p-4 border border-gray-300 rounded">
      <p {...props.attributes}>{props.node.content}</p>
    </NodeViewWrapper>
  );
};
const CustomParagraphNode = Node.create({
  name: "customParagraph",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{ tag: "p.custom-paragraph" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, class: "custom-paragraph" }, 0];
  },
  addNodeView() {
    return ReactNodeViewRenderer(StyledParagraph);
  },
});

const StyledHeading = (props: any) => {
  const HeadingTag = `h${props.node.attrs.level}`;
  return (
    <NodeViewWrapper className="prose prose-xl font-bold m-4 p-4 border-b border-gray-300">
      <HeadingTag {...props.attributes}>{props.node.content}</HeadingTag>
    </NodeViewWrapper>
  );
};

const StyledBlockquote = (props: any) => {
  return (
    <NodeViewWrapper className="prose prose-lg italic m-4 p-4 border-l-4 border-gray-300 pl-4">
      <blockquote {...props.attributes}>{props.node.content}</blockquote>
    </NodeViewWrapper>
  );
};

const StyledCodeBlock = (props: any) => {
  return (
    <NodeViewWrapper className="prose prose-lg bg-gray-100 m-4 p-4 rounded">
      <pre {...props.attributes}>
        <code>{props.node.content}</code>
      </pre>
    </NodeViewWrapper>
  );
};

const StyledListItem = (props: any) => {
  return (
    <NodeViewWrapper className="prose prose-lg m-4 p-4 list-disc list-inside">
      <li {...props.attributes}>{props.node.content}</li>
    </NodeViewWrapper>
  );
};

const StyledOrderedList = (props: any) => {
  return (
    <NodeViewWrapper className="prose prose-lg m-4 p-4 list-decimal list-inside">
      <ol {...props.attributes}>{props.node.content}</ol>
    </NodeViewWrapper>
  );
};

const StyledBulletList = (props: any) => {
  return (
    <NodeViewWrapper className="prose prose-lg m-4 p-4 list-disc list-inside">
      <ul {...props.attributes}>{props.node.content}</ul>
    </NodeViewWrapper>
  );
};

const StyledHorizontalRule = (props: any) => {
  return (
    <NodeViewWrapper className="prose prose-lg m-4 p-4 border-t border-gray-300">
      <hr {...props.attributes} />
    </NodeViewWrapper>
  );
};

const StyledImage = (props: any) => {
  return (
    <NodeViewWrapper className="prose prose-lg m-4 p-4">
      <img
        {...props.attributes}
        src={props.node.attrs.src}
        alt={props.node.attrs.alt}
      />
    </NodeViewWrapper>
  );
};

const StyledBold = (props: any) => {
  return <strong {...props.attributes}>{props.node.content}</strong>;
};

const StyledItalic = (props: any) => {
  return <em {...props.attributes}>{props.node.content}</em>;
};

const StyledStrike = (props: any) => {
  return <s {...props.attributes}>{props.node.content}</s>;
};

const StyledCode = (props: any) => {
  return <code {...props.attributes}>{props.node.content}</code>;
};

const StyledCheckbox = (props: any) => {
  return (
    <NodeViewWrapper className="prose prose-lg m-4 p-4">
      <input
        type="checkbox"
        {...props.attributes}
        checked={props.node.attrs.checked}
      />
      {props.node.content}
    </NodeViewWrapper>
  );
};

export {
  CustomParagraphNode,
  StyledHeading,
  StyledBlockquote,
  StyledCodeBlock,
  StyledListItem,
  StyledOrderedList,
  StyledBulletList,
  StyledHorizontalRule,
  StyledImage,
  StyledBold,
  StyledItalic,
  StyledStrike,
  StyledCode,
  StyledCheckbox,
};
