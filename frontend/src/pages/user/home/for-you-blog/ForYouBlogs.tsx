import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BiBookmark } from "react-icons/bi";
import { BsBookmarkFill } from "react-icons/bs";
import { FcLikePlaceholder } from "react-icons/fc";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllPublicBlogs } from "~/apis/blog.api";
import axios from "~/config/axios";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { useStoreContext } from "~/contexts/StoreProvider";
import { DEFAULT_IMG, HOST, PATH } from "~/utils/constants";
import toastOption from "~/utils/constants/toastOption";
import { useAuth } from "~/utils/helpers";
import { BlogItem } from "~/utils/models/blog.model";

const limitBlogs = 8;

function ForYouBlogs() {
  const [fullBlogList, setFullBlogList] = useState<BlogItem[]>([]);
  const [showedBlogs, setShowedBlogs] = useState<BlogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const axiosPrivate = useAxiosPrivate();
  const { bookmarkList, setBookmarkList } = useStoreContext();
  const { userGlobal } = useAuth();

  const paginateChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
    setShowedBlogs(fullBlogList.slice((page - 1) * limitBlogs, page * limitBlogs));
  };

  useEffect(() => {
    (async function () {
      try {
        let blogs;
        if (userGlobal) {
          const { data } = await axiosPrivate.get(HOST + "/api/v1/blogs/for-you");
          blogs = data.data;
        } else {
          const { data } = await getAllPublicBlogs();
          blogs = data.data;
        }
        setFullBlogList(blogs);
        setShowedBlogs(blogs.slice((currentPage - 1) * limitBlogs, currentPage * limitBlogs));
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [userGlobal]);

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
    <div className="mb-4 flex flex-col">
      {showedBlogs?.map(blog => (
        <div key={blog._id} className="flex gap-5 mb-7 py-2 px-4 flex-[1] border rounded-md ">
          <Link
            to={`${PATH.BLOG}/${blog._id}`}
            className="w-1/3 rounded-md overflow-hidden max-h-fit"
          >
            <img
              src={blog.thumbnail || DEFAULT_IMG}
              alt="thumbnail"
              className="object-cover h-full w-full"
            />
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
              </div>
              <Link
                to={`${PATH.BLOG}/${blog._id}`}
                className=" text-base font-bold break-words line-clamp-2"
              >
                {blog.title}
              </Link>
              <p className="text-sm line-clamp-3">{blog.description}</p>
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
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-bold">{blog.userId.fullName}</span>
                </Link>
                <span className="flex items-center text-xs">
                  <AiOutlineEye className="text-xl mr-1" />
                  {blog.numView}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Pagination
        defaultCurrent={1}
        current={currentPage}
        defaultPageSize={limitBlogs}
        total={fullBlogList.length}
        className="self-center"
        onChange={paginateChange}
      />
    </div>
  );
}

export default ForYouBlogs;
