import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { TextDirective } from "mdast-util-directive";
import { MdxJsxTextElement } from "mdast-util-mdx-jsx";

export interface TerminologyOptions {
  terminology?: string;
  item?: string;
  preview?: string;
}

interface Directive extends TextDirective {
  name: string;
}

const remarkTerminology: Plugin<[TerminologyOptions?]> = (
  options?: TerminologyOptions
) => {
  const {
    terminology = "Terminology",
    item = "TermItem",
    preview = "TermPreview",
  } = options || {};
  const assertTextDirective = (node: any) => {
    if (node.type === "textDirective" && (node as Directive).name === "term") {
      const directiveNode = node as Directive;
      const attributes = directiveNode.attributes || {};
      directiveNode.data = directiveNode.data || {};

      const jsxNode: MdxJsxTextElement = {
        type: "mdxJsxTextElement",
        name: preview,
        attributes: Object.entries(attributes).map(([name, value]) => {
          switch (name) {
            case "id":
            case "anchor":
              return {
                type: "mdxJsxAttribute",
                name: "anchor",
                value,
              };
            case "class":
            case "path":
              return {
                type: "mdxJsxAttribute",
                name: "path",
                value,
              };
            default:
              return {
                type: "mdxJsxAttribute",
                name,
                value,
              };
          }
        }),
        children: directiveNode.children,
      };
      Object.assign(node, jsxNode);
    }
  };

  const assertTermContainerDirective = (node: any) => {
    if (
      node.type === "containerDirective" &&
      (node as Directive).name === "term"
    ) {
      const directiveNode = node as Directive;
      const attributes = directiveNode.attributes || {};

      const jsxNode: MdxJsxTextElement = {
        type: "mdxJsxTextElement",
        name: item,
        attributes: Object.entries(attributes).map(([name, value]) => {
          switch (name) {
            case "id":
            case "slug":
              return {
                type: "mdxJsxAttribute",
                name: "slug",
                value,
              };
            case "class":
            case "authors":
              return {
                type: "mdxJsxAttribute",
                name: "authors",
                value,
              };
            case "title":
              return {
                type: "mdxJsxAttribute",
                name: "title",
                value,
              };
            default:
              return {
                type: "mdxJsxAttribute",
                name,
                value,
              };
          }
        }),
        children: directiveNode.children,
      };
      Object.assign(node, jsxNode);
    }
  };

  const assertTerminologyContainer = (node: any) => {
    if (
      node.type === "containerDirective" &&
      (node as Directive).name === "terminology"
    ) {
      const containerNode = node as Directive;
      const attributes = containerNode.attributes || {};
      const jsxNode: MdxJsxTextElement = {
        type: "mdxJsxTextElement",
        name: terminology,
        attributes: Object.entries(attributes).map(([name, value]) => {
          return {
            type: "mdxJsxAttribute",
            name,
            value,
          };
        }),
        children: containerNode.children,
      };
      Object.assign(node, jsxNode);
    }
  };

  return (tree) => {
    visit(tree, (node) => {
      assertTextDirective(node);
      assertTermContainerDirective(node);
      assertTerminologyContainer(node);
    });
  };
};

export default remarkTerminology;
