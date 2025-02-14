import fs from "fs";
import path from "path";
import type { Plugin } from "@docusaurus/types";
import type { Configuration, RuleSetRule, RuleSetUseItem } from "webpack";

export interface DocusaurusContext {
  baseUrl: string;
  siteDir: string;
  generatedFilesDir: string;
  i18n: {
    currentLocale: string;
  };
}

export interface WebpackRule extends RuleSetRule {
  oneOf?: RuleSetRule[];
  use?: RuleSetUseItem[] | RuleSetUseItem;
}

export interface ConfigureWebpackUtils {
  getStyleLoaders: (...args: any[]) => any[];
  getCacheLoader: (...args: any[]) => any;
  getBabelLoader: (...args: any[]) => any;
}

export interface TerminologyOptions {
  baseUrl?: string;
  resolved?: boolean;
  glossaryTerms?: Record<string, any>;
  termPreviewComponentPath?: string;
}

export default async function DocusaurusTerminologyPlugin(
  context: DocusaurusContext,
  options: TerminologyOptions
): Promise<Plugin<any>> {
  try {
    fs.rm("node_modules/.cache", { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  } catch (err) {}
  return {
    name: "terminology-docusaurus-plugin",
    configureWebpack(config, isServer, utils, content) {
      options.baseUrl = config.output?.publicPath as string;

      if (!options.resolved) {
        for (const term in options.glossaryTerms) {
          options.glossaryTerms[`${config.output?.publicPath}${term}`] =
            options.glossaryTerms[term];
          delete options.glossaryTerms[term];
        }
      }
      options.resolved = true;

      const rules = config.module?.rules as WebpackRule[];
      let rule = rules.find((rule) => {
        return (
          rule.use &&
          Array.isArray(rule.use) &&
          rule.use.some(
            (kider: RuleSetUseItem) =>
              typeof kider === "object" &&
              typeof kider.loader === "string" &&
              kider.loader.includes("plugin-content-blog")
          )
        );
      });

      if (!rule) {
        rule = rules.find((rule) => {
          return (
            rule.use &&
            Array.isArray(rule.use) &&
            rule.use.some(
              (kider: RuleSetUseItem) =>
                typeof kider === "object" &&
                typeof kider.loader === "string" &&
                kider.loader.includes("mdx-loader")
            )
          );
        });
      }

      if (!rule) {
        rule = rules.find((rule) => {
          if (!rule.test) return false;
          const ruleRegExp = new RegExp(rule.test as string);
          return ruleRegExp.test("test.md") && ruleRegExp.test("test.mdx");
        });
      }

      if (
        rule &&
        Array.isArray(rule.use) &&
        !rules.find((r) => {
          return (
            r.use &&
            Array.isArray(r.use) &&
            r.use.some(
              (kider: RuleSetUseItem) =>
                typeof kider === "object" &&
                typeof kider.loader === "string" &&
                kider.loader.includes("heliannuuthus-webpack-terms-loader")
            )
          );
        })
      ) {
        rule.use.unshift({
          loader: require.resolve("heliannuuthus-webpack-terms-loader"),
          options,
        });
      }
      if (
        rule &&
        Array.isArray(rule.use) &&
        !rules.find((r) => {
          return (
            r.use &&
            Array.isArray(r.use) &&
            r.use.some(
              (kider: RuleSetUseItem) =>
                typeof kider === "object" &&
                typeof kider.loader === "string" &&
                kider.loader.includes(
                  "heliannuuthus-webpack-terms-replace-loader"
                )
            )
          );
        })
      ) {
        rule.use.push({
          loader: require.resolve("heliannuuthus-webpack-terms-replace-loader"),
          options,
        });
      }
      return {
        mergeStrategy: { module: "replace" },
        module: config.module,
      };
    },
  };
}
