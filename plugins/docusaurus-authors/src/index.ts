import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import type { LoadContext, Plugin } from "@docusaurus/types";

interface AuthorsListPluginOptions {
  path: string;
}

export interface Author {
  name: string;
  title: string;
  url: string;
  image_url: string;
  socials: Record<string, string>;
}

interface AuthorsContent {
  authors: Author[];
}

export default async function authorsListPlugin(
  context: LoadContext,
  opts: AuthorsListPluginOptions,
): Promise<Plugin<AuthorsContent>> {
  return {
    name: "authors-docusaurus-plugin",
    async loadContent() {
      // 读取 YAML 文件
      const authorsPath = path.join(context.siteDir, opts.path);
      const authorsYaml = fs.readFileSync(authorsPath, "utf8");
      const authors = yaml.load(authorsYaml) as Author[];
      return { authors };
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      // 设置全局数据
      setGlobalData({
        authors: (content as AuthorsContent).authors,
      });
    },
  };
}
