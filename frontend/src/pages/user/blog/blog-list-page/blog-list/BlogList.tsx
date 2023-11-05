import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import { DEFAULT_IMG, limitBlogs } from "~/utils/constants";
import { FilterList } from "../BlogListPage";
import { Pagination } from "antd";

interface BlogListProps {
  filters: FilterList;
  setFilters: React.Dispatch<React.SetStateAction<FilterList>>;
}

const BlogList = ({ filters, setFilters }: BlogListProps) => {
  const [showedBlogs, setShowedBlogs] = useState<BlogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const axiosPrivate = useAxiosPrivate();
  const { bookmarkList, setBookmarkList } = useStoreContext();
  const [fullBlogList, setFullBlogList] = useState<BlogItem[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogItem[]>([]);
  const { userGlobal } = useAuth();

  const paginateChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
    setShowedBlogs(filteredBlogs.slice((page - 1) * limitBlogs, page * limitBlogs));
  };

  useEffect(() => {
    (async function () {
      try {
        const { data } = await getAllPublicBlogs();
        setFullBlogList(data.data);

        if (filters.category.length === 0 && filters.tag.length === 0) {
          setFilteredBlogs(data.data);
          setShowedBlogs(data.data.slice((currentPage - 1) * limitBlogs, currentPage * limitBlogs));
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (filters.category.length === 0 && filters.tag.length === 0) {
      setFilteredBlogs(fullBlogList);
      setShowedBlogs(filteredBlogs.slice((currentPage - 1) * limitBlogs, currentPage * limitBlogs));
    } else {
      const filtered = fullBlogList.filter(blog => {
        if (filters.category.length === 0) {
          if (blog.blogTagIds.some(tag => filters.tag.includes(tag._id))) {
            return true;
          }
          return false;
        }

        if (filters.tag.length === 0) {
          if (filters.category.includes(blog.blogCateId._id)) {
            return true;
          }
          return false;
        }

        const isCategoryMatch = filters.category.includes(blog.blogCateId._id);
        const isTagMatch = blog.blogTagIds.some(tag => filters.tag.includes(tag._id));
        return isCategoryMatch || isTagMatch;
      });
      setFilteredBlogs(filtered);

      setShowedBlogs(filtered.slice((currentPage - 1) * limitBlogs, currentPage * limitBlogs));
    }
  }, [filters, fullBlogList]);

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
    <div className="mb-4 flex flex-col">
      {showedBlogs?.map(blog => (
        <div key={blog._id} className="max-h-44 flex gap-5 mb-7 flex-[1] box-border">
          <Link to={`${PATH.BLOG}/${blog._id}`} className="w-1/3 rounded-md overflow-hidden ">
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
                    {blog.totalPoint}
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
              <Link
                to={`${PATH.BLOG}/${blog._id}`}
                className=" text-base font-bold break-words line-clamp-2"
              >
                {blog.title}
              </Link>
              <p className="text-sm line-clamp-2">{blog.description}</p>
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
              {/* tag list */}
              <div className="flex overflow-x-hidden">
                {blog.blogTagIds?.map(tag => (
                  <span
                    key={tag._id}
                    onClick={() => setFilters({ ...filters, tag: [tag._id] })}
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
      <Pagination
        defaultCurrent={1}
        current={currentPage}
        defaultPageSize={limitBlogs}
        total={filteredBlogs.length}
        className="self-center"
        onChange={paginateChange}
      />
    </div>
  );
};

export default BlogList;
