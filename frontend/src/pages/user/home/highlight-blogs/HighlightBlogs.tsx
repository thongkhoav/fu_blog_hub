import { useEffect, useState } from "react";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { FcLikePlaceholder } from "react-icons/fc";
import { BlogItem } from "~/utils/models/blog.model";
import { Link } from "react-router-dom";
import { PATH } from "~/utils/constants";
import axios from "~/config/axios";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { useStoreContext } from "~/contexts/StoreProvider";
import { useAuth } from "~/utils/helpers";
import toastOption from "~/utils/constants/toastOption";
import { toast } from "react-toastify";
import { BsBookmarkFill } from "react-icons/bs";

export default function HighlightBlogs() {
  const [hlBlogs, sethlBlogs] = useState<BlogItem[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { bookmarkList, setBookmarkList } = useStoreContext();
  const { userGlobal } = useAuth();
  useEffect(() => {
    axios.get(`/api/v1/blogs/highlight`).then(res => {
      sethlBlogs(res.data.data);
    });
  }, []);

  const toggleBookmark = async (blogId: string, toRemove: boolean) => {
    try {
      if (toRemove) {
        await axiosPrivate.put(`/api/v1/bookmarks/${blogId}/remove`);
        setBookmarkList((prev: string[]) => prev.filter(id => id !== blogId));
        toast.success("Removed from bookmark list", toastOption);
      } else {
        await axiosPrivate.post(`/api/v1/bookmarks/${blogId}`);
        setBookmarkList((prev: any) => [...prev, blogId]);
        toast.success("Added to bookmark list", toastOption);
      }
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };
  return (
    <div
      className="w-full grid grid-cols-2 [&>*:nth-child(odd)]:pr-4
    [&>*:nth-child(even)]:pl-4 mb-4"
    >
      {hlBlogs?.map(blog => (
        <div key={blog._id + "asdsd"} className="h-48 flex gap-5 mb-5 flex-[1] box-border">
          <Link to={`${PATH.BLOG}/${blog._id}`} className="w-1/3 rounded-sm max-h-fit">
            <img src={blog.thumbnail} alt="thumbnail" className="object-cover h-full w-full" />
          </Link>
          <div className="flex flex-col justify-between w-2/3">
            <div>
              <div className="flex justify-between">
                {/* category, point and bookmark */}
                <section className="flex items-center gap-2">
                  <span className="text-sm uppercase">{blog.blogCateId.name}</span>
                  <hr className="w-[1px] h-[70%] bg-slate-300" />
                  <span className="flex gap-1 items-center">
                    <FcLikePlaceholder />
                    {blog.totalPoint}
                  </span>
                </section>
                <span className="text-xl cursor-pointer">
                  {userGlobal ? (
                    <span className="text-xl cursor-pointer">
                      {bookmarkList.includes(blog._id) ? (
                        <BsBookmarkFill onClick={() => toggleBookmark(blog._id, true)} />
                      ) : (
                        <BiBookmark onClick={() => toggleBookmark(blog._id, false)} />
                      )}
                    </span>
                  ) : (
                    <Link to={PATH.LOGIN} className="text-xl cursor-pointer">
                      <BiBookmark />
                    </Link>
                  )}
                </span>
              </div>
              <Link
                to={`${PATH.BLOG}/${blog._id}`}
                className="hover:text-blue-500 text-base font-bold break-words line-clamp-2"
              >
                {blog.title}
              </Link>
              <p className="text-xs line-clamp-3">{blog.description}</p>
            </div>
            <div>
              {/* user and views */}
              <div className="flex justify-between mb-2">
                <Link
                  to={`/profile/${userGlobal?._id === blog.userId._id ? "me" : blog.userId._id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={blog.userId.avatar}
                    alt="avatar author"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold">{blog.userId.fullName}</span>
                </Link>
                <span className="flex items-center text-xs">
                  <AiOutlineEye className="text-xl mr-1" />
                  {blog.numView}
                </span>
              </div>
              {/* tag list */}
              <div className="flex overflow-x-hidden">
                {blog.blogTagIds.map(tag => (
                  <Link
                    to={`${PATH.BLOG}`}
                    key={tag._id}
                    state={{ tag: [tag._id] }}
                    className="text-sm text-inherit px-2 py-1 mr-2 rounded-sm bg-[#f2f2f2]"
                  >
                    {tag.name}
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
