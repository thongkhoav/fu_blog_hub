// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import Code from "@editorjs/code";
// @ts-ignore
import Delimiter from "@editorjs/delimiter";
// @ts-ignore
import Embed from "@editorjs/embed";
// @ts-ignore
import Image from "@editorjs/image";
// @ts-ignore
import InlineCode from "@editorjs/inline-code";
// @ts-ignore
import LinkTool from "@editorjs/link";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Marker from "@editorjs/marker";
// @ts-ignore
import Quote from "@editorjs/quote";
// @ts-ignore
import Raw from "@editorjs/raw";
// @ts-ignore
import SimpleImage from "@editorjs/simple-image";
// @ts-ignore
import Table from "@editorjs/table";
// @ts-ignore
import Warning from "@editorjs/warning";
// @ts-ignore
import Header from "@editorjs/header";
// @ts-ignore
import Paragraph from "@editorjs/paragraph";
import {HOST} from "~/utils/constants/server";

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  // table: Table,
  // warning: Warning,
  // code: Code,
  linkTool: LinkTool,
  image: {
    class: Image,
    uploader: {
      uploadByFile(file: any) {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);
          fetch(`${HOST}/api/upload`, {
            method: "POST",
            body: formData
          })
            .then(res => res.json())
            .then(res => {
              resolve({
                success: 1,
                file: {
                  url: res.data.url
                }
              });
            })
            .catch(err => {
              reject(err);
            });
        });
      }
    },
    inlineToolbar: true
  },
  quote: Quote,
  marker: Marker,
  delimiter: Delimiter,
  // simpleImage: SimpleImage,
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: "Tiêu đề bài viết....."
    }
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    config: {
      placeholder: "Nội dung bài viết....."
    }
  }
};
