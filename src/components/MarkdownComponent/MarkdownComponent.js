import React, { useState } from 'react';
import { BlockEditable } from 'markdown-translatable';

const MarkdownComponent = ({
  markdown,
}) => {
  const [preview, SetPreview] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          console.log("--- --- ---");
          console.log("Current state:" + markdown);
          SetPreview(!preview);
        }}
      >
        {!preview ? "Markdown" : "HTML"}
      </button>
      <BlockEditable
        markdown={markdown}
        preview={preview}
        // onEdit={(_markdown) => {
        //   setState({ _markdown });
        // }}
      />
    </div>
  );
};

export default MarkdownComponent;
