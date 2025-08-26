import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { BiBookmark } from "react-icons/bi";
import { BsBookmarkFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllPublicBlogs, getSameAuthorBlogs, getSameCateBlogs } from "~/apis/blog.api";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { useStoreContext } from "~/contexts/StoreProvider";
import { PATH, DEFAULT_IMG } from "~/utils/constants";
import toastOption from "~/utils/constants/toastOption";
import { useAuth } from "~/utils/helpers";
import { BlogDetail, BlogItem, BlogNavItem } from "~/utils/models/blog.model";
// blog detail will shows blogs with same author and same category
// blog filter list will shows featured blogs and new blogs

function BlogsSide({ blogDetail }: { blogDetail: BlogDetail }) {
  const [authorBlogs, setAuthorBlogs] = useState<BlogNavItem[]>([]);
  const [cateBlogs, setCateBlogs] = useState<BlogNavItem[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { userGlobal } = useAuth();
  const { bookmarkList, setBookmarkList } = useStoreContext();

  useEffect(() => {
    (async function () {
      try {
        const { data: authorBlogs } = await getSameAuthorBlogs(
          blogDetail._id,
          blogDetail.userId._id
        );
        setAuthorBlogs(authorBlogs.data);
        const { data: cateBlogs } = await getSameCateBlogs(
          blogDetail._id,
          blogDetail.blogCateId._id
        );
        setCateBlogs(cateBlogs.data);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    })();
  }, [blogDetail.blogCateId._id, blogDetail.userId._id]);

  const toggleBookmark = async (blogId: string, toRemove: boolean) => {
    if (!userGlobal) {
      toast.info("Please login to bookmark", toastOption);
      return;
    }
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
    <div className="flex-1 flex flex-col gap-4 mt-2">
      <h1 className="text-base uppercase font-bold">Author: {blogDetail.userId.fullName}</h1>
      {authorBlogs.length === 0 ? (
        <p>No other posts from this author</p>
      ) : (
        authorBlogs.map(blog => (
          <div
            key={blog._id}
            className="border rounded-md p-1 h-30 w-full flex flex-row gap-2 box-border"
          >
            <Link to={`${PATH.BLOG}/${blog._id}`} className="flex-1">
              <img
                src={blog.thumbnail}
                alt="thumbnail"
                className="w-full h-full object-cover rounded-md"
              />
            </Link>
            <div className="flex-[3] flex flex-col justify-between">
              <div className="flex justify-between">
                <Link to={`${PATH.BLOG}/${blog._id}`} className="text-xs uppercase cursor-pointer">
                  {blog.blogCateId.name}
                </Link>
                <span className="text-xl cursor-pointer">
                  {userGlobal && bookmarkList.includes(blog._id) ? (
                    <Tooltip title="Remove bookmark">
                      <BsBookmarkFill onClick={() => toggleBookmark(blog._id, true)} />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Bookmark">
                      <BiBookmark onClick={() => toggleBookmark(blog._id, false)} />
                    </Tooltip>
                  )}
                </span>
              </div>
              <Link
                to={`${PATH.BLOG}/${blog._id}`}
                className="break-words font-bold line-clamp-2 text-sm mb-2"
              >
                {blog.title}
              </Link>
              <p className="text-xs line-clamp-2">{blogDetail.description}</p>
            </div>
          </div>
        ))
      )}

      <hr className="w-1px bg-slate-300 my-1" />

      <h1 className="text-base uppercase font-bold">Category: {blogDetail.blogCateId.name}</h1>
      {cateBlogs.length === 0 ? (
        <p>No other posts from this category</p>
      ) : (
        cateBlogs.map(blog => (
          <div key={blog._id} className="border rounded-md p-1 h-30 w-full grid grid-cols-4 gap-2">
            <Link to={`${PATH.BLOG}/${blog._id}`} className="">
              <img
                src={blog.thumbnail}
                alt="thumbnail"
                className="w-full h-full object-cover rounded-md"
              />
            </Link>
            <div className="flex flex-col justify-between relative gap-1 col-span-3">
              <div className="flex justify-between gap-1">
                <Link
                  to={`${PATH.BLOG}/${blog._id}`}
                  className="text-sm line-clamp-2 break-words font-bold"
                >
                  {blog.title}
                </Link>
                <span className="text-xl cursor-pointer">
                  {userGlobal && bookmarkList.includes(blog._id) ? (
                    <Tooltip title="Remove bookmark">
                      <BsBookmarkFill onClick={() => toggleBookmark(blog._id, true)} />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Bookmark">
                      <BiBookmark onClick={() => toggleBookmark(blog._id, false)} />
                    </Tooltip>
                  )}
                </span>
              </div>
              <p className="text-xs line-clamp-2">{blogDetail.description}</p>
              <div>
                {/* user */}
                <div className="flex justify-between">
                  <Link
                    to={`/profile/${userGlobal?._id === blog.userId._id ? "me" : blog.userId._id}`}
                    className="flex items-center gap-3"
                  >
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
        ))
      )}
    </div>
  );
}

export default BlogsSide;
