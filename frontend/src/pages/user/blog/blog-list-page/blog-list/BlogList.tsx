import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { BlogItem } from "~/utils/models/blog.model";
import { FcLikePlaceholder } from "react-icons/fc";
import { getAllPublicBlogs } from "~/apis/blog.api";
import { toast } from "react-toastify";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { BsBookmarkFill } from "react-icons/bs";
import toastOption from "~/utils/constants/toastOption";
import { useStoreContext } from "~/contexts/StoreProvider";
import { useAuth } from "~/utils/helpers";

const BlogList = ({ filters, setFilters }: { filters: any; setFilters: any }) => {
  const [blogList, setBlogList] = useState<BlogItem[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { bookmarkList, setBookmarkList } = useStoreContext();
  const { userGlobal } = useAuth();

  useEffect(() => {
    (async function () {
      try {
        const { data } = await getAllPublicBlogs();
        setBlogList(data.data);
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [filters]);

  const toggleBookmark = async (blogId: string, toRemove: boolean) => {
    try {
      if (toRemove) {
        await axiosPrivate.put(`/api/v1/bookmarks/${blogId}/remove`);
        setBookmarkList((prev: string[]) => prev.filter(id => id !== blogId));
        toast.success("Đã xóa khỏi danh sách bookmark", toastOption);
      } else {
        await axiosPrivate.post(`/api/v1/bookmarks/${blogId}`);
        setBookmarkList((prev: any) => [...prev, blogId]);
        toast.success("Đã thêm vào danh sách bookmark", toastOption);
      }
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  return (
    <>
      {blogList.map(blog => (
        <div key={blog._id} className="h-44 flex gap-5 mb-7 flex-[1] box-border">
          <Link
            to={`${PATH.BLOG}/${blog._id}`}
            className="w-1/3 rounded-md overflow-hidden max-h-fit"
          >
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
                    {blog.numComment}
                  </span>
                </section>
                {userGlobal && (
                  <span className="text-xl cursor-pointer">
                    {bookmarkList.includes(blog._id) ? (
                      <BsBookmarkFill onClick={() => toggleBookmark(blog._id, true)} />
                    ) : (
                      <BiBookmark onClick={() => toggleBookmark(blog._id, false)} />
                    )}
                  </span>
                )}
              </div>
              <Link to={`${PATH.BLOG}/${blog._id}`} className=" text-base font-bold line-clamp-2">
                {blog.title}
              </Link>
              <p className="text-sm line-clamp-3">{blog.description}</p>
            </div>
            <div>
              {/* user and views */}
              <div className="flex justify-between mb-2">
                <Link
                  to={`/profile/${userGlobal._id === blog.userId._id ? "me" : blog.userId._id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={blog.userId.avatar}
                    alt="avatar author"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-bold">{blog.userId.fullName}</span>
                </Link>
                <span className="flex items-center text-xs">
                  <AiOutlineEye className="text-xl mr-1" />
                  {blog.numView}
                </span>
              </div>
              {/* tag list */}
              <div className="flex overflow-x-hidden">
                {blog.blogTagIds?.map(tag => (
                  <span
                    key={tag._id}
                    onClick={() => setFilters({ ...filters, tag: [tag] })}
                    className="cursor-pointer text-sm text-inherit px-2 py-1 mr-2 rounded-sm bg-[#f2f2f2]"
                  >
                    {tag.name}
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
