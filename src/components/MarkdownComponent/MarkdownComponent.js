import React, { useState } from "react";
import { BlockEditable } from "markdown-translatable";

const MarkdownComponent = ({ markdown, onMarkdownChange }) => {
  const [preview, setPreview] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          console.log("--- --- ---");
          console.log("Current state:" + markdown);
          setPreview(!preview);
        }}
      >
        {!preview ? "Markdown" : "HTML"}
      </button>
      <BlockEditable
        markdown={markdown}
        preview={preview}
        onEdit={(_markdown) => {
          onMarkdownChange(_markdown);
        }}
      />
    </div>
  );
};

export default MarkdownComponent;
