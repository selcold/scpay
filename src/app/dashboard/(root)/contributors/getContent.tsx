"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function GetMarkdownContent() {
  const [markdownContent, setMarkdownContent] = useState<string>("");

  useEffect(() => {
    // GitHub APIのエンドポイントからMarkdownを取得
    fetch("/contributors.md")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Markdownファイルの取得に失敗しました");
        }
        return response.text();
      })
      .then((text) => setMarkdownContent(text))
      .catch((error) => console.error(error));
  }, []);

  return (
    <ReactMarkdown
      className="markdown-body"
      remarkPlugins={[remarkGfm]}
      components={{
        a(props) {
          const { children, href } = props;
          return (
            <Link href={href || "/"} target="_blank">
              {children}
            </Link>
          );
        },
      }}
    >
      {markdownContent}
    </ReactMarkdown>
  );
}

export default GetMarkdownContent;
