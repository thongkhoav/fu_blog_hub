import { useContext, useEffect, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Space } from "antd";
import { RenderListContext } from "../Comment";
import { EllipsisOutlined } from "@ant-design/icons";
import { useAuth } from "~/utils/helpers";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import DropDown from "../DropDown/DropDown";
import moment from "moment";
import { render } from "react-dom";
export interface AvartarProps {
  _id: string;
  parentId: number;
  userId: {
    avatar: string;
    fullName: string;
  };
  createdAt: string;
  content: string;
  children: AvartarProps[];
  replyStatus: boolean;
  editStatus: boolean;
  status: boolean;
  isParent: boolean;
}

export function Avartar({ RenderParentList, blogId, setList }: any) {
  const axiosPrivate = useAxiosPrivate();
  const { userGlobal } = useAuth();
  const [Edit, setEdit] = useState(false);
  const [Reply, setReply] = useState(false);
  const [Status, setStatus] = useState(true);
  const [EditValue, setEditValue] = useState("");
  const { renderList, setRenderList } = useContext(RenderListContext);
  const { ComId, SetComId } = useContext(RenderListContext);
  const [ReplyContent, setReplyContent] = useState("");
  const parentData = RenderParentList;
  const [lastCommentTime, setLastCommentTime] = useState(0);
  useEffect(() => {}, []);

  const handleEditChange = (event: any) => {
    setEditValue(event.target.value);
  };

  const handlerReplyChange = (event: any) => {
    setReplyContent(event.target.value);
  };

  const handleEditPost = async (comment: any) => {
    try {
      const updateComment = await axiosPrivate.put(`/api/v1/comment/edit/${comment.id}`, {
        contentProps: EditValue as string,
        parentId: userGlobal._id as string
      });
      const data = updateComment.data.data;
      console.log(data);
      let list = parentData.map((com: any) => {
        com.key = com.id;
        if (com.id == data._id) {
          com.content = data.content;
          com.editStatus = false;
          setEdit(false);
          return com;
        } else if (com.children.length > 0) {
          let childComment = com.children.map((child: any) => {
            if (child.id == data._id) {
              child.content = data.content;
              child.editStatus = !child.editStatus;
              setEdit(false);
              return child;
            } else {
              return child;
            }
          });
          com.children = childComment;
          return com;
        } else {
          return com;
        }
      });
      setEdit(false);
      setList(list);
      //  parentData.map((comment: AvartarProps) => {
      //   if (comment._id == parent._id) {
      //     return (comment.content = EditValue, comment.editStatus = false, setEdit(false));
      //   }else if(comment.children.length > 0){
      //       let list = comment.children.map((child: any) =>{
      //         if(child._id == parent._id){
      //           return (child.content = EditValue, child.editStatus = false, setEdit(false));
      //         }
      //       }

      //     )
      //     return list;
      //   }
      // });
    } catch (error) {
      console.log(error);
    }
  };

  const handlerNewReply = async (parenId: string) => {
    try {
      if (!userGlobal) {
        return;
      }

      if (Date.now() - lastCommentTime < 5000) {
        // You can show an error message or take other actions as needed
        console.log("You can only reply a comment every 5 seconds.");
        return;
      }
      const updateParentComment = await axiosPrivate.put(`/api/v1/comment/${parenId}`, {
        userId: userGlobal._id as string,
        blogId: blogId,
        content: ReplyContent
      });
      const data = updateParentComment.data.data;
      const child = updateParentComment.data.children;

      let avatarValue = {
        key: data._id,
        id: data._id,
        parentId: -1,
        srcAvartar: data.userId.avatar,
        nameAvartar: data.userId.fullName,
        timeComment: moment(data.createdAt).format("DD-MM-YYYY"),
        content: data.content,
        replyStatus: false,
        editStatus: false,
        status: true,
        isParent: data.isParent,
        children: data.children?.map((children: any) => ({
          key: children._id,
          id: children._id,
          parentId: data._id,
          srcAvartar: children.userId.avatar,
          nameAvartar: children.userId.fullName,
          timeComment: moment(children.createdAt).format("DD-MM-YYYY"),
          content: children.content,
          replyStatus: false,
          editStatus: false,
          status: true,
          children: [],
          isParent: false
        }))
      };
      const newChildComment = {
        id: child._id,
        parentId: data._id,
        srcAvartar: data.userId.avatar,
        nameAvartar: data.userId.fullName,
        timeComment: moment(data.createdAt).format("DD-MM-YYYY"),
        content: data.content,
        replyStatus: false,
        editStatus: false,
        status: true,
        children: [],
        isParent: false
      };
      setReply(false);

      let list = parentData.map((com: any) => {
        if (com.id == avatarValue.id) {
          setReply(false);
          console.log("ra ne");
          return avatarValue;
        } else {
          return com;
        }
      });

      setList(list);
      setLastCommentTime(Date.now());

      // Clear the reply content field
      setReplyContent("");
      const textarea = document.getElementById("commentReply") as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = "";
      }

      // console.log(parentData)
    } catch (error) {
      console.log(error);
    }
  };

  const handlerButtonReply = (commentId: any) => {
    const list = parentData.map((com: any) => {
      if (com.id == commentId) {
        com.replyStatus = true;
        setReply(!Reply);
        return com;
      } else {
        com.replyStatus = false;
        return com;
      }
    });
    setRenderList(list);
  };

  const RenderList: any = (
    <>
      {parentData
        .filter((parent: any) => parent.status && parent.isParent)
        .map((parent: any) => {
          return (
            <>
              <article
                key={parent.id}
                className="p-6 text-base bg-white rounded-lg dark:bg-gray-900"
              >
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                      <img
                        className="mr-2 w-6 h-6 rounded-full"
                        src={parent.srcAvartar}
                        alt={parent._id + parent.nameAvartar}
                      />
                      {parent.nameAvartar}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <time>{parent.timeComment}</time>
                    </p>
                  </div>
                  <>
                    <DropDown
                      comment={parent}
                      parentData={parentData}
                      updateRenderList={setRenderList}
                      setEdit={setEdit}
                      Edit={Edit}
                    />
                  </>
                </footer>
                {Edit && parent.editStatus && (
                  <>
                    <textarea
                      id="commentReply"
                      className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                      required
                      onChange={handleEditChange}
                      placeholder={parent.content}
                    ></textarea>

                    <button
                      className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                      onClick={() => handleEditPost(parent)}
                    >
                      Post Edit
                    </button>
                  </>
                )}

                {!parent.editStatus && (
                  <p className="text-gray-500 dark:text-gray-400">{parent.content}</p>
                )}
                <div className="flex items-center mt-4 space-x-4">
                  <Space>
                    <Button type="text" onClick={() => handlerButtonReply(parent.id)}>
                      <SendOutlined />
                      Reply
                    </Button>
                  </Space>
                </div>
                {Reply && parent.replyStatus && (
                  <div>
                    <textarea
                      className="px-0 w-full text-sm text-gray-400 border-1 rounded-lg focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-800 dark:bg-gray-600"
                      onChange={handlerReplyChange}
                      required
                    ></textarea>
                    <button
                      onClick={() => handlerNewReply(parent.id)}
                      className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </article>

              {parent.children != undefined &&
                parent.children.length > 0 &&
                parent.children
                  .filter((children: any) => children.status == true)
                  .map((children: any) => (
                    <>
                      <article
                        key={children.id}
                        className="border-t-2 p-3 mb-3 ml-6 lg:ml-12 text-base bg-white dark:bg-gray-900"
                      >
                        <>
                          <footer className="flex justify-between items-center mb-2">
                            <div className="inline-flex items-center">
                              <p className="inline-flex items-center pr-8 mb-6 ml-6 lg:ml-12 text-gray-600 dark:text-white font-semibold">
                                <img
                                  className=" w-6 h-6 rounded-full mr-2"
                                  src={children.srcAvartar}
                                  alt={children.nameAvartar}
                                />
                                {children.nameAvartar}
                                <p className="ml-4 text-xs text-gray-500 dark:text-gray-500">
                                  <time>{children.timeComment}</time>
                                </p>
                              </p>
                            </div>
                            <DropDown
                              comment={children}
                              parentData={parentData}
                              updateRenderList={setRenderList}
                              setEdit={setEdit}
                              Edit={Edit}
                            />
                          </footer>
                          {Edit && children.editStatus && (
                            <div className="pr-6">
                              <textarea
                                id="commentChildren"
                                className="pt-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                required
                                onChange={handleEditChange}
                                placeholder={children.content}
                              ></textarea>

                              <button
                                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                                onClick={() => handleEditPost(children)}
                              >
                                Post Edit
                              </button>
                            </div>
                          )}
                          <>
                            {!children.editStatus && (
                              <p className="mb-3  ml-6 lg:ml-12 text-gray-500 dark:text-gray-400">
                                {children.content}
                              </p>
                            )}
                          </>
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
