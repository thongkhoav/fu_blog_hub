import { HOST } from "~/utils/constants/server";
import { UploadAdapter, FileLoader } from "@ckeditor/ckeditor5-upload/src/filerepository";
import axios from "axios";
import { Editor } from "@ckeditor/ckeditor5-core";
import { RcFile } from "antd/es/upload";
import { message } from "antd";

function uploadAdapter(loader: FileLoader): UploadAdapter {
  return {
    upload: () => {
      return new Promise(async (resolve, reject) => {
        try {
          const file = await loader.file;
          const response = await axios.request({
            method: "POST",
            url: `${HOST}/api/upload`,
            data: {
              image: file
            },
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          resolve({
            default: `${response.data.file.url}`
          });
        } catch (error) {
          reject("Hello");
        }
      });
    },
    abort: () => {}
  };
}
function uploadPlugin(editor: Editor) {
  // @ts-ignore
  editor.plugins.get("FileRepository").createUploadAdapter = loader => {
    return uploadAdapter(loader);
  };
}
export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
export const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
export default uploadPlugin;
