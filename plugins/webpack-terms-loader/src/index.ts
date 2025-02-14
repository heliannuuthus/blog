import { createHash } from "crypto";
import { parse } from "heliannuuthus-parse-md";
import { store, TermMetadata, TermData } from "heliannuuthus-terminology-store";
import type { LoaderContext } from "webpack";

interface WebpackTermsLoaderOptions {
  termsDir: string;
}

interface WebpackTermsLoaderContext
  extends LoaderContext<WebpackTermsLoaderOptions> {
  query: WebpackTermsLoaderOptions;
}

export default async function loader(
  this: WebpackTermsLoaderContext,
  source: string
) {
  this.cacheable(false);
  const unixRegex = new RegExp(
    `(${this.query.termsDir
      .replace(/^\.\//, "")
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*?)\.(md|mdx)`
  );

  const winRegex = new RegExp(
    `(${this.query.termsDir
      .replace(/\//g, "\\")
      .replace(/\./, "")
      .replace(/[*+?^${}()|[\]\\]/g, "\\$&")}.*?)\.(md|mdx)`
  );

  const unixResourcePath = this.resourcePath;
  const winResourcePath = this.resourcePath.replace(/\\/, "\\\\");

  const termMatch =
    process.platform === "win32"
      ? winResourcePath.match(winRegex)
      : unixResourcePath.match(unixRegex);
  if (termMatch) {

    const resourcePath = termMatch[1].replace(/\d+-/, "");

    store.addTerm(resourcePath, source);

    this.emitFile(resourcePath + ".json", JSON.stringify(source));

    // const termMap = terms.reduce((acc, term) => {
    //   acc[term.metadata.slug] = {
    //     ...term,
    //     metadata: {
    //       ...term.metadata,
    //       description: term.metadata.description,
    //       authors: term.metadata.authors || ["robot"],
    //     },
    //     content: term.content,
    //   };
    //   return acc;
    // }, {} as Record<string, TermData>);
    // store.addTerm(resourcePath, termMap);
    // this.emitFile(resourcePath + ".json", JSON.stringify(termMap));
  }
  return source;
}
