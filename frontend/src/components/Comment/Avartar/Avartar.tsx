import { useContext, useEffect, useState } from "react";
import DropDown from "../DropDown/DropDown";
import { SendOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { RenderListContext, getDate } from "../Comment";

export interface AvartarProps {
  id: number;
  parentId: number;
  srcAvartar: string;
  nameAvartar: string;
  timeComment: string;
  comment: string;
  childrent: AvartarProps[];
  replyStatus: boolean;
}
export function Avartar({ RenderParentList }: any) {
  const [Reply, SetReply] = useState(false);
  const { renderList, setRenderList } = useContext(RenderListContext);
  const { ComId, SetComId } = useContext(RenderListContext);
  const [ReplyContent, setReplyContent] = useState("");
  const parentData = RenderParentList;
  console.log("🚀 ~ file: Avartar.tsx:30 ~ Avartar ~ parentData:", parentData);

  useEffect(() => {
    console.log("RenderList updated:", RenderList);
  }, [parentData]);

  const handlerReplyChange = (event: any) => {
    setReplyContent(event.target.value);
  };
  const handlerReply = (parentId: number) => {
    SetComId(ComId + 1);
    const AvatarValue: AvartarProps = {
      id: ComId,
      parentId: parentId,
      srcAvartar:
        "https://people.com/thmb/anC_C5AnAfUnuEYsr9oevgbnc4M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/harvey-dog-lopsided-smile-031523-4-e9a52b74aa1744598d8d6dd63e3506a5.jpg",
      nameAvartar: "Test Name",
      timeComment: getDate(),
      comment: ReplyContent,
      childrent: [],
      replyStatus: false
    };
    parentData.map((data: AvartarProps) => {
      if (data.id === parentId) {
        data.childrent.push(AvatarValue);
        console.log("🚀 ~ file: Avartar.tsx:50 ~ parentData.map ~ AvatarValue:", AvatarValue);
      }
    });

    setRenderList([...parentData]);
    SetReply(false);
  };

  const handlerButtonReply = (commentId: number) => {
    const list = parentData.map((comment: AvartarProps) => {
      if (comment.id == commentId) {
        return (comment.replyStatus = !comment.replyStatus), SetReply(!Reply);
      } else {
        return (comment.replyStatus = false);
      }
    });
    setRenderList(list);
  };

  const RenderList: any = (
    <>
      {parentData.map((parent: AvartarProps) => {
        return (
          <>
            <article key={parent.id} className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                    <img
                      className="mr-2 w-6 h-6 rounded-full"
                      src={parent.srcAvartar}
                      alt={parent.id + parent.nameAvartar}
                    />
                    {parent.nameAvartar}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <time>{parent.timeComment}</time>
                  </p>
                </div>
                <DropDown />
              </footer>
              <p className="text-gray-500 dark:text-gray-400">{parent.comment}</p>

              <div className="flex items-center mt-4 space-x-4">
                <Space>
                  <Button type="text" onClick={() => handlerButtonReply(parent.id)}>
                    <SendOutlined />
                    Reply
                  </Button>
                  {Reply && parent.replyStatus && (
                    <div>
                      <textarea onChange={handlerReplyChange}></textarea>
                      <button
                        onClick={() => handlerReply(parent.id)}
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </Space>
              </div>
            </article>
            {parent.childrent != undefined &&
              parent.childrent.length > 0 &&
              parent.childrent.map((childrent: AvartarProps) => (
                <>
                  <article
                    key={childrent.id}
                    className="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-90"
                  >
                    <>
                      <footer className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <p className="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
                            <img
                              className="mr-2 w-6 h-6 rounded-full"
                              src={childrent.srcAvartar}
                              alt={childrent.nameAvartar}
                            />
                            {childrent.nameAvartar}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <time>{childrent.timeComment}</time>
                          </p>
                        </div>
                        <DropDown />
                      </footer>
                      <p className="p-6 mb-3 ml-6 lg:ml-12  text-gray-500 dark:text-gray-400">
                        {childrent.comment}
                      </p>
                    </>
                  </article>
                </>
              ))}
          </>
        );
      })}
    </>
  );

  return (
    <>
      <div>{RenderList}</div>
    </>
  );
}

export default Avartar;
