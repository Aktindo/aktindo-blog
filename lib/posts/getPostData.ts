import fs from "fs";
import matter from "gray-matter";
import path from "path";
import MarkdownIt from "markdown-it/index";
import MarkdownItTableOfContents from "markdown-it-table-of-contents/index";
import hljs from "highlight.js";
import { Post } from "../../pages/_app";

export async function getPostData(id) {
  const fullPath = path.join(process.cwd(), "posts", `${id}.md`);
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true })
              .value +
            "</code></pre>"
          );
        } catch (__) {}
      }

      return (
        '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
      );
    },
  });

  md.use(MarkdownItTableOfContents);
  md.use(require("markdown-it-task-lists"));

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const processedContent = md.render(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    ...matterResult.data,
    contentHtml,
  } as Post;
}
