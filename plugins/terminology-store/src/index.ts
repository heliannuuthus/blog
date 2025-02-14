import fs from "fs";
import path from "path";

const docusaurusPath = path.resolve(".docusaurus");
const glossaryPath = path.resolve(".docusaurus/glossary.json");

export interface TermMetadata {
  slug: string;
  title: string;
  description: string;
  authors: string[];
}

export interface TermData {
  metadata: TermMetadata;
  content: string;
}

class TerminologyStore {
  terms: Record<string, string> = {};
  updated: string[] = [];
  private static instance: TerminologyStore;

  constructor() {
    if (!fs.existsSync(docusaurusPath)) {
      fs.mkdirSync(docusaurusPath);
    }

    fs.writeFileSync(glossaryPath, "{}");
    this.terms = this.readGlossary();
    this.updated = Object.keys(this.terms);
  }

  addTerm(resourcePath: string, source: string) {
    this.terms[resourcePath] = source;
    fs.writeFileSync(glossaryPath, JSON.stringify(this.terms));
    this.setUpdatedResourcePath(resourcePath);
    return { resourcePath };
  }

  exists(resourcePath: string): boolean {
    return resourcePath in this.terms;
  }

  readGlossary(): Record<string, string> {
    return JSON.parse(fs.readFileSync(glossaryPath, "utf8"));
  }

  setUpdatedResourcePath(resourcePath: string): void {
    this.updated.push(resourcePath);
  }

  clearUpdatedResourcePaths(): void {
    this.updated = [];
  }

  public static getInstance(): TerminologyStore {
    if (!this.instance) {
      this.instance = new TerminologyStore();
    }
    return this.instance;
  }
}

export const store = TerminologyStore.getInstance();
