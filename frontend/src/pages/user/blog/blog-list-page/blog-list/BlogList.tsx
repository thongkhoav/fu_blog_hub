import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { BlogItem } from "~/utils/models/blog.model";
import { FcLikePlaceholder } from "react-icons/fc";

const BlogList = ({ filters, setFilters }: { filters: any; setFilters: any }) => {
  const [blogList, setBlogList] = useState<BlogItem[]>([]);
  useEffect(() => {
    setBlogList(
      [...Array(10)].map((_, index) => ({
        id: index.toString(),
        title: "Sử dụng AI trong Kiểm Thử Phần Mềm: Hướng Dẫn Chi Tiết và Lợi Ích",
        introduction:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium minus aperiam inventore sunt excepturi doloremque quis rerum ducimus eligendi tenetur.",
        category: "Kinh tế",
        thumbnail:
          "https://media.istockphoto.com/id/518954548/photo/open-moleskin-book-with-fountain-pen-on-wood.jpg?s=612x612&w=0&k=20&c=vFTPdHQlk5OJYuh2ShF8TE33NqdVUqdkYosLrxIm87k=",
        comments: 323,
        views: 231,
        tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9"],
        createAt: new Date(),
        author: {
          avatar: "https://cdn-icons-png.flaticon.com/512/1995/1995562.png",
          id: "1a",
          levelColor: "#FF0000",
          name: "Nguyễn Văn A"
        }
      }))
    );
  }, [filters]);

  return (
    <>
      {blogList.map(blog => (
        <div key={blog.id} className="h-48 flex gap-5 mb-7 flex-[1] box-border">
          <Link
            to={`${PATH.BLOG}/${blog.id}`}
            className="w-1/3 rounded-md overflow-hidden max-h-fit"
          >
            <img src={blog.thumbnail} alt="thumbnail" className="object-cover h-full w-full" />
          </Link>
          <div className="flex flex-col justify-between w-2/3">
            <div>
              <div className="flex justify-between">
                {/* category, point and bookmark */}
                <section className="flex items-center gap-2">
                  <span className="text-sm uppercase">{blog.category}</span>
                  <hr className="w-[1px] h-[70%] bg-slate-300" />
                  <span className="flex gap-1 items-center">
                    <FcLikePlaceholder />
                    {blog.comments}
                  </span>
                </section>
                <span className="text-xl cursor-pointer">
                  <BiBookmark />
                </span>
              </div>
              <Link to={`${PATH.BLOG}/${blog.id}`} className=" text-base font-bold line-clamp-2">
                {blog.title}
              </Link>
              <p className="text-sm line-clamp-3">{blog.introduction}</p>
            </div>
            <div>
              {/* user and views */}
              <div className="flex justify-between mb-2">
                <Link to="/profile/123" className="flex items-center gap-3">
                  <img
                    src={blog.author.avatar}
                    alt="avatar author"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-bold">{blog.author.name}</span>
                </Link>
                <span className="flex items-center text-xs">
                  <AiOutlineEye className="text-xl mr-1" />
                  {blog.views}
                </span>
              </div>
              {/* tag list */}
              <div className="flex overflow-x-hidden">
                {blog.tags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => setFilters({ ...filters, tag: [tag] })}
                    className="cursor-pointer text-sm text-inherit px-2 py-1 mr-2 rounded-sm bg-[#f2f2f2]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogList;
