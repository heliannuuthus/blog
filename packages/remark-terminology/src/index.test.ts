import { describe, expect, test } from "vitest";
import { compile } from "@mdx-js/mdx";
import remarkTerminology from ".";
import remarkDirective from "remark-directive";

describe("remarkTerminology", () => {
  const process = async (content: string) => {
    const file = await compile(content, {
      outputFormat: "function-body",
      remarkPlugins: [remarkDirective, remarkTerminology],
      rehypePlugins: [],
      jsx: true,
    });

    return file.toString();
  };

  test("应该正确转换简单的 terminology preview 语法", async () => {
    const input = "这是一个:term[ terminology 内容]{./path1/subpath1#content}";
    const output = await process(input);
    expect(output).toContain(
      '<TermPreview path="/path1/subpath1" anchor="content">{" terminology 内容"}</TermPreview>'
    );
  });

  test("应该处理一块 terminology item", async () => {
    const input = `这是一个 
:::term{title="多行标题" #content .author1 .author2}
多行
内容
:::`;
    const output = await process(input);
    console.log(output);
    expect(output).toContain(
      `<TermItem title="多行标题" slug="content" authors="author1 author2"><_components.p>{"多行\\n内容"}</_components.p></TermItem>`
    );
  });

  test("嵌套的语法", async () => {
    const input = `这是一个 
::::terminology
:::term{title="多行标题" #content .author1 .author2}
这是:term[\`内容\`]{./path1/subpath1#content}但是指向的是谁呢
:::
::::
`;
    const output = await process(input);
    console.log(output);
    expect(output).toContain(`<Terminology>`);
    expect(output).toContain(
      `<TermPreview path="/path1/subpath1" anchor="content"><_components.code>{"内容"}</_components.code></TermPreview>`
    );
    expect(output).toContain(
      `<TermItem title="多行标题" slug="content" authors="author1 author2">`
    );
  });
});
