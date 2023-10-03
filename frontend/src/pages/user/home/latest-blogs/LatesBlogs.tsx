import { useEffect, useState } from "react";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { FcLikePlaceholder } from "react-icons/fc";
import { BlogItem } from "~/utils/models/blog.model";
import { Link } from "react-router-dom";

export default function LatestBlogs({ blogsData }: { blogsData: BlogItem[] }) {
  const [latestBlogs, setLatestBlogs] = useState<BlogItem[]>(blogsData);
  useEffect(() => {}, []);
  return (
    <div className="w-full grid grid-cols-3 gap-8 px-5">
      {[...latestBlogs, latestBlogs[0]].map(blog => (
        <div key={blog.id} className="h-96 flex flex-col flex-[1] box-border">
          <img
            src={blog.thumbnail}
            alt="thumbnail"
            className="w-full h-40 object-cover mb-2 rounded-md"
          />
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between">
                <span className="text-sm uppercase">{blog.category}</span>
                <span className="text-2xl cursor-pointer">
                  <BiBookmark />
                </span>
              </div>
              <h1 className=" text-xl font-bold mb-2">{blog.title}</h1>
              <p className="text-xs line-clamp-2 text-justify mb-2">{blog.introduction}</p>
            </div>
            <div>
              {/* user and views */}
              <div className="flex justify-between mb-1">
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
