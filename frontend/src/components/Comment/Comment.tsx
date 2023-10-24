import React, { useState, createContext, useEffect } from "react";
import Avartar, { AvartarProps } from "./Avartar/Avartar";
import { useAuth } from "~/utils/helpers";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import moment from "moment";
import { redirect } from "react-router-dom";

export const RenderListContext = createContext<RenderListContextProps>({
  renderList: [],
  setRenderList: () => { },
  ComId: 0,
  SetComId: () => { }
});

export interface RenderListContextProps {
  renderList: any[];
  setRenderList: React.Dispatch<React.SetStateAction<any[]>>;
  ComId: number;
  SetComId: React.Dispatch<React.SetStateAction<number>>;
}


export default function Comment({ idBlog }: { idBlog: string }) {
  const axiosPrivate = useAxiosPrivate();
  const { userGlobal } = useAuth();
  const [Content, setContent] = useState("");
  const [ComId, SetComId] = useState(4);
  const [RenderList, setRenderList] = useState<any[]>([]);


  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axiosPrivate.get(`/api/v1/comment/${idBlog}`);
        const commentLists = res.data.data?.map((com: AvartarProps) => ({
          key: com._id,
          id: com._id,
          parentId: -1,
          srcAvartar: com.userId.avatar,
          nameAvartar: com.userId.fullName,
          timeComment: moment(com.createdAt).format("DD-MM-YYYY"),
          content: com.content,
          replyStatus: false,
          editStatus: false,
          status: com.status,
          isParent: com.isParent,
          children: com.children?.map((children: AvartarProps) => ({
            key:children._id,
            id: children._id,
            parentId: com._id,
            srcAvartar: children.userId.avatar,
            nameAvartar: children.userId.fullName,
            timeComment: moment(children.createdAt).format("DD-MM-YYYY"),
            content: children.content,
            replyStatus: false,
            editStatus: false,
            status: children.status,
            children: [],
            isParent: children.isParent,
          })),
        }))
        setRenderList(commentLists)
      } catch (error: any) {
        console.log(error);
      }
    }
    getComments();
  }, []);



  const handleChange = (event: any) => {
    setContent(event.target.value);
  };

  const handleAddNewComment = async () => {
    try {
      if(!userGlobal){
        return redirect("/login");
      }
      const res = await axiosPrivate.post("/api/v1/comment", {
      userId: userGlobal._id as string,
      chidren: [],
      blogId: idBlog,
      content: Content,
      });
      const data = res.data.data
     
      const avatarValue = {
          id: data._id,
          parentId: -1,
          srcAvartar: data.userId.avatar,
          nameAvartar: data.userId.fullName,
          timeComment: data.createdAt,
          content: data.content,
          replyStatus: false,
          editStatus: false,
          status: true,
          chidlren:[],
          isParent: data.isParent,
      }
      // add new comment to render list
      setRenderList([avatarValue, ...RenderList])
      setContent("")
   
    } catch (error: any) {
      console.log(error);

    }
  };

 

  return (
    <div className="flex ml-2 pt-5 justify-between text-gray-400 border-t border-gray-200">
      <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div className="max-w-2xl mx-auto px-4">
          {/* //title */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              Discussion
            </h2>
          </div>

          {/* //form comment */}

          {/* <form className="mb-6"> */}
          <div className="py-2 px-6 mb-6 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label className="sr-only">Your comment</label>
            <textarea
              id="comment"
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              placeholder="Write a comment..."
              required
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            onClick={handleAddNewComment}
          >
            Post comment
          </button>
          {/* <ReplyChild renderList={RenderList} /> */}
          <RenderListContext.Provider
            value={{ renderList: RenderList, setRenderList, ComId: ComId, SetComId }}
          >
            {/* Existing component code */}
          </RenderListContext.Provider>
          <Avartar RenderParentList={RenderList} blogId={idBlog} />
        </div>
      </section>
    </div>
  );
}
