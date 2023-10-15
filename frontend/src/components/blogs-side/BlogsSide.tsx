import { useEffect, useState } from "react";
import { BiBookmark } from "react-icons/bi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllPublicBlogs } from "~/apis/blog.api";
import toastOption from "~/utils/constants/toastOption";
import { BlogItem, BlogNavItem } from "~/utils/models/blog.model";

// blog detail thì blog cùng tác giả và blogs cùng category
// blog filter list thì blog nổi bật và blog mới

function BlogsSide() {
  const [authorBlogs, setAuthorBlogs] = useState<BlogNavItem[]>([]);

  useEffect(() => {
    (async function () {
      try {
        const { data } = await getAllPublicBlogs();
        setAuthorBlogs(data.data);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    })();
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-5">
      {/* cùng tác giả thì bỏ author avatar và name */}
      <h1 className="uppercase font-bold">Viết bởi tác giả xxx</h1>
      {authorBlogs.map(blog => (
        <div key={blog._id} className="h-30 w-full flex flex-row gap-2 box-border">
          <Link to="/profile/123" className="flex-1">
            <img
              src={blog.thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover rounded-sm"
            />
          </Link>
          <div className="flex-[3] flex flex-col justify-between">
            <div className="flex justify-between">
              <span className="text-sm uppercase ">{blog.blogCateId.name}</span>
              <span className="text-xl cursor-pointer">
                <BiBookmark />
              </span>
            </div>
            <h1 className=" text-sm mb-2 line-clamp-2">{blog.title}</h1>
          </div>
        </div>
      ))}

      <hr className="w-1px bg-slate-300 my-1" />

      {/* cùng chủ đề thì bỏ  chủ đề trên cùng */}
      <h1 className="uppercase font-bold">Cùng chủ đề: Kinh tế</h1>
      {authorBlogs.map(blog => (
        <div key={blog._id} className="h-30 w-full flex flex-row gap-2 box-border">
          <Link to="/profile/123" className="flex-1">
            <img
              src={blog.thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover rounded-sm"
            />
          </Link>
          <div className="flex-[3] flex flex-col justify-between relative">
            <span className="text-xl cursor-pointer absolute right-1 top-1">
              <BiBookmark />
            </span>
            <h1 className=" text-sm mb-2 line-clamp-2">{blog.title}</h1>
            <div>
              {/* user */}
              <div className="flex justify-between">
                <Link to="/profile/123" className="flex items-center gap-3">
                  <img
                    src={blog.userId.avatar}
                    alt="avatar author"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold line-clamp-1">{blog.userId.fullName}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BlogsSide;
