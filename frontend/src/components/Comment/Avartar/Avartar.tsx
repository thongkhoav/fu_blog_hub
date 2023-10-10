import React, { useState } from "react";
import Demo from "../DropDown/DropDown";
import { SendOutlined } from "@ant-design/icons";
import ReplyComment from "../reply/Reply";
import { Button, Space } from "antd";
import Comment from "../Comment";

export interface AvartarProps {
  id: Number;
  srcAvartar: string;
  nameAvartar: string;
  timeComment: string;
  comment: string;
  child: any;
}
// export const useGlobalState = () => {
//   const context = useContext(GlobalStateContext);
//   if (!context) {
//     throw new Error('useGlobalState must be used within a GlobalStateProvider');
//   }
//   return context;
// };
function Avartar({ srcAvartar, nameAvartar, timeComment, comment, id, child }: AvartarProps) {
  const [ReplyContent, setReplyContent] = useState("");
  const [Reply, setReply] = useState(false);

  const handlerChange = (event: any) => {
    setReplyContent(event.target.value);
  };
  const handlerReply = () => {};
  const ReplyHandler = () => {
    setReply(!Reply);
  };

  return (
    <>
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            <img className="mr-2 w-6 h-6 rounded-full" src={srcAvartar} alt={id + nameAvartar} />
            {nameAvartar}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time>{timeComment}</time>
          </p>
        </div>
        <Demo />
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{comment}</p>

      <div className="flex items-center mt-4 space-x-4">
        <Space>
          <Button type="text" onClick={ReplyHandler}>
            <SendOutlined />
            Reply
          </Button>
          {Reply && (
            <div>
              <textarea onChange={handlerChange}></textarea>
              <button className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                Reply
              </button>
            </div>
          )}
        </Space>
      </div>
    </>
  );
}

export default Avartar;
