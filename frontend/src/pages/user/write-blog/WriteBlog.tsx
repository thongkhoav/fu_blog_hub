import { ButtonTitle } from "~/utils/constants/buttonTitle";
import "./write-blog.scss";
import EditorJS from '@editorjs/editorjs';
import {useRef} from "react";
import ReactEditor from "~/pages/user/write-blog/EditorJS";

interface Props {
  mode?: ButtonTitle.CREATE | ButtonTitle.EDIT;
}

export default function WriteBlog({ mode = ButtonTitle.CREATE }: Props) {

  return (
    <div className="w-full">
      <div className="container m-auto py-8">
        {/* Editor blog */}
        <ReactEditor />
      </div>
    </div>
  );
}
