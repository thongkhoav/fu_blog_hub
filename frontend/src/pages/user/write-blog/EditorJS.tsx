import React, { useEffect, useRef } from "react";
import uploadPlugin from "~/utils/constants/uploadPlugin";
import "./write-blog.scss";

// @ts-ignore
function Editor({ onChange, editorLoaded, name, value }) {
  const editorRef = useRef();
  // @ts-ignore
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    // @ts-ignore
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic")
    };
  }, []);

  return (
    <div>
      {editorLoaded ? (
        <CKEditor
          type=""
          name={name}
          editor={ClassicEditor}
          config={{
            toolbar: {
              items: [
                'heading',
                'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                'link', 'uploadImage', 'blockQuote', 'codeBlock',
                'alignment',
              ],
            },
            extraPlugins: [uploadPlugin]
          }}
          data={value}
          onChange={(event:any, editor:any) => {
            const data = editor.getData();
            onChange(data);
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </div>
  );
}

export default Editor;
