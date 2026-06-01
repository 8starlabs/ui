import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import rehypePrettyCode from "rehype-pretty-code";

import { transformers } from "@/lib/highlight-code";

export const docs = defineDocs({
  dir: "lib/docs"
});

export default defineConfig({
  mdxOptions: {
    rehypePlugins: (plugins) => {
      plugins.shift();
      plugins.push([
        rehypePrettyCode as any,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default"
          },
          transformers
        }
      ]);

      return plugins;
    }
  }
});
