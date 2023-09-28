import ReactDOM from "react-dom";
import React, { Component } from "react";
import "./write-blog.scss";

import { createReactEditorJS } from "react-editor-js";

import { EDITOR_JS_TOOLS } from "~/utils/constants/editorJsTools";

const ReactEditorJS = createReactEditorJS();
export default function ReactEditor() {

  return (
    <ReactEditorJS
      tools={EDITOR_JS_TOOLS} // tools prop is required
      autofocus={true}
      defaultValue={{
        time: 1635603431943,
        blocks: [
          {
            id: "sheNwCUP5A",
            type: "header",
            data: {
              level: 1,
              text: "Tiêu đề ....",
            },

          },
          {
            id: "12iM3lqzcm",
            type: "paragraph",
            data: {
              text: "Nội dung ....",
            },
          },
        ]
      }}
    />
  );
}
