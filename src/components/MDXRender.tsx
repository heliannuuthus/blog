// MDXRenderer.jsx
import React, { useEffect, useState, Suspense } from "react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";

import type { UseMdxComponents } from "@mdx-js/mdx";
import remarkCommentTooltip from "heliannuuthus-remark-comment-tooltip";
import remarkDirective from "remark-directive";
import remarkExternalLink from "heliannuuthus-remark-external-link";
import MDXComponents from "@theme/MDXComponents";
import { MDXProvider } from "@mdx-js/react";

const MDXRender = ({
  content,
  components,
}: {
  content: string;
  components?: UseMdxComponents | null;
}) => {
  const [Component, setComponent] = useState(() => () => null);
  const evaluateContent = async () => {
    await evaluate(content, {
      ...runtime,
      remarkPlugins: [
        remarkDirective,
        remarkCommentTooltip,
        [
          remarkExternalLink,
          {
            href: "/external-link",
            target: "_blank",
            rel: ["noopener", "noreferrer"],
            test: (node: any) => node.url.startsWith("http"),
          },
        ],
      ],
      useMDXComponents: components,
    }).then((exports) => {
      setComponent(() => exports.default);
    });
  };

  useEffect(() => {
    evaluateContent();
  }, [content]);

  if (!Component) {
    return (
      <MDXProvider
        components={() => {
          return {
            ...components(),
            ...MDXComponents,
          };
        }}
      >
        <div>unknown component</div>
      </MDXProvider>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MDXProvider
        components={() => {
          return {
            ...components(),
            ...MDXComponents,
          };
        }}
      >
        <Component />
      </MDXProvider>
    </Suspense>
  );
};

export default MDXRender;
