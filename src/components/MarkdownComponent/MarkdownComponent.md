# MarkdownComponent

A Markdown file viewer and editor.

```jsx
import React, { useEffect, useState } from "react";
import MarkdownComponent from "./MarkdownComponent";
import { useRsrc } from "scripture-resources-rcl";

function Component() {
  // TODO: Make PR on scripture-resources-rcl
  // Add support for ta & tw in useResource // https://scripture-resources-rcl.netlify.app/#/Resources%20
  // Later: think about offline support

  const [preview, setPreview] = useState(false);
  const [markdown, setMarkdown] = useState("");
  // const reference = { bookId: 'tit', chapter: 1, verse: 1, filePath: '' };
  const reference = {
    bookId: "translate",
    chapter: 1,
    verse: 1,
    filePath: "figs-metaphor/01.md",
  };
  const resourceLink = "unfoldingWord/en/ta/master";
  const config = {
    server: "https://git.door43.org",
    cache: {
      maxAge: 1 * 1 * 1 * 60 * 1000, // override cache to 1 minute
    },
  };

  const { state, actions } = useRsrc({
    resourceLink,
    reference,
    config,
  });

  console.log("state", state);

  useEffect(async () => {
    async function getFile() {
      const file = await actions.getFile();
      setMarkdown(file || "");
    }

    if (actions.getFile) {
      getFile();
    }
  });

  return (
    <MarkdownComponent markdown={markdown} onMarkdownChange={setMarkdown} />
  );
}

<Component />;
```
