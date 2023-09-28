import { useEffect, useState } from "react";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { FcLikePlaceholder } from "react-icons/fc";
import { BlogItem } from "~/utils/models/blog.model";
import { Link } from "react-router-dom";
import { PATH } from "~/utils/constants";

export default function HighlightBlogs({ blogsData }: { blogsData: BlogItem[] }) {
  const [hlBlogs, sethlBlogs] = useState<BlogItem[]>(blogsData);
  useEffect(() => {}, []);
  return (
    <div
      className="w-full grid grid-cols-2 [&>*:nth-child(odd)]:pr-4
    [&>*:nth-child(even)]:pl-4 mb-4"
    >
      {[...hlBlogs, ...hlBlogs].map(blog => (
        <div key={blog.id} className="h-48 flex gap-5 mb-5 flex-[1] box-border">
          <Link to={`${PATH.BLOG}/${blog.id}`} className="w-1/3 rounded-sm max-h-fit">
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
              <h1 className=" text-base font-bold">{blog.title}</h1>
              <p className="text-xs line-clamp-3">{blog.introduction}</p>
            </div>
            <div>
              {/* user and views */}
              <div className="flex justify-between mb-2">
                <Link to="/profile/123" className="flex items-center gap-3">
                  <img
                    src={blog.author.avatar}
                    alt="avatar author"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold">{blog.author.name}</span>
                </Link>
                <span className="flex items-center text-xs">
                  <AiOutlineEye className="text-xl mr-1" />
                  {blog.views}
                </span>
              </div>
              {/* tag list */}
              <div className="flex overflow-x-hidden">
                {blog.tags.map(tag => (
                  <Link
                    to={`/blogs?tag=${tag}`}
                    key={tag}
                    className="text-sm text-inherit px-2 py-1 mr-2 rounded-sm bg-[#f2f2f2]"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
