import React, { useState, createContext } from "react";

import Avartar, { AvartarProps } from "./Avartar/Avartar";

export const RenderListContext = createContext<RenderListContextProps>({
  renderList: [],
  setRenderList: () => {},
  ComId: 0,
  SetComId: () => {}
});

export interface RenderListContextProps {
  renderList: any[];
  setRenderList: React.Dispatch<React.SetStateAction<any[]>>;
  ComId: number;
  SetComId: React.Dispatch<React.SetStateAction<number>>;
}

export function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}, ${date}, ${year}`;
}

export default function Comment() {
  const [Content, setContent] = useState("");
  const [ComId, SetComId] = useState(3);
  const [RenderList, setRenderList] = useState<any[]>([
    {
      id: 0,
      parentId: -1,
      srcAvartar:
        "https://people.com/thmb/anC_C5AnAfUnuEYsr9oevgbnc4M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/harvey-dog-lopsided-smile-031523-4-e9a52b74aa1744598d8d6dd63e3506a5.jpg",
      nameAvartar: "Test1",
      timeComment: getDate(),
      comment: "Content",
      replyStatus: false,
      childrent: [
        {
          id: 1,
          parentId: 0,
          srcAvartar:
            "https://people.com/thmb/anC_C5AnAfUnuEYsr9oevgbnc4M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/harvey-dog-lopsided-smile-031523-4-e9a52b74aa1744598d8d6dd63e3506a5.jpg",
          nameAvartar: "testname",
          timeComment: getDate(),
          comment: "comment test linh hoang"
        }
      ]
    },
    {
      id: 2,
      parentId: -1,
      srcAvartar:
        "https://people.com/thmb/anC_C5AnAfUnuEYsr9oevgbnc4M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/harvey-dog-lopsided-smile-031523-4-e9a52b74aa1744598d8d6dd63e3506a5.jpg",
      nameAvartar: "Test2",
      timeComment: getDate(),
      comment: "Content",
      replyStatus: false,
      childrent: [
        {
          id: 3,
          parentId: 2,
          srcAvartar:
            "https://people.com/thmb/anC_C5AnAfUnuEYsr9oevgbnc4M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/harvey-dog-lopsided-smile-031523-4-e9a52b74aa1744598d8d6dd63e3506a5.jpg",
          nameAvartar: "testname",
          timeComment: getDate(),
          comment: "comment test linh hoang"
        }
      ]
    }
  ]);

  const handleChange = (event: any) => {
    setContent(event.target.value);
  };

  const handlePost = (e: any) => {
    SetComId(ComId + 1);
    const AvatarValue: AvartarProps = {
      id: ComId,
      parentId: -1,
      srcAvartar:
        "https://people.com/thmb/anC_C5AnAfUnuEYsr9oevgbnc4M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/harvey-dog-lopsided-smile-031523-4-e9a52b74aa1744598d8d6dd63e3506a5.jpg",
      nameAvartar: "Test Name",
      timeComment: getDate(),
      comment: Content,
      replyStatus: false,
      childrent: []
    };

    setRenderList([AvatarValue, ...RenderList]);
  };

  return (
    <div className="flex ml-2 pt-5 pb-16 justify-between text-gray-400 border-t border-gray-200">
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
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
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
            onClick={handlePost}
          >
            Post comment
          </button>
          {/* <ReplyChild renderList={RenderList} /> */}
          <RenderListContext.Provider
            value={{ renderList: RenderList, setRenderList, ComId: ComId, SetComId }}
          >
            {/* Existing component code */}
          </RenderListContext.Provider>
          <Avartar RenderParentList={RenderList} />
        </div>
      </section>
    </div>
  );
}
