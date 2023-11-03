import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BiBookmark } from "react-icons/bi";
import { BsBookmarkFill } from "react-icons/bs";
import { FcLikePlaceholder } from "react-icons/fc";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSeriesBlogs } from "~/apis/blog.api";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { useStoreContext } from "~/contexts/StoreProvider";
import { DEFAULT_IMG, PATH } from "~/utils/constants";
import toastOption from "~/utils/constants/toastOption";
import { useAuth } from "~/utils/helpers";
import { BlogItem } from "~/utils/models/blog.model";
import { BookmarkBlogItem } from "~/utils/models/bookmark.model";
import { Series } from "../Series";

interface SeriesDetail {
  series: Series;
  blogs: BlogItem[];
}

function SeriesDetailPage() {
  const [seriesDetail, setSeriesDetail] = useState<SeriesDetail>();
  const axiosPrivate = useAxiosPrivate();
  const { idSeries } = useParams();
  const navigate = useNavigate();
  const { userGlobal } = useAuth();
  const { bookmarkList, setBookmarkList } = useStoreContext();
  useEffect(() => {
    (async function () {
      try {
        if (!idSeries) return;
        const { data } = await getSeriesBlogs(idSeries);
        setSeriesDetail(data.data);
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [idSeries]);

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
    <div className="w-4/5 min-w-[600px]">
      <div className="relative">
        <h2 className="text-center">{seriesDetail?.series.title}</h2>
        <p className="text-center mb-5 text-slate-500">{seriesDetail?.series.description}</p>
        <Tooltip placement="right" title="Trở về danh sách series">
          <span
            className="absolute left-7 top-5 text-3xl cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <IoMdArrowRoundBack />
          </span>
        </Tooltip>
      </div>
      <div className="mb-4 flex flex-col">
        {seriesDetail?.blogs.length ? (
          seriesDetail?.blogs.map(blog => (
            <div key={blog._id} className="h-40 flex gap-5 mb-7 flex-[1] box-border shadow-md p-4">
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
                  <p className="text-sm line-clamp-3">{blog.description}</p>
                </div>
                <div>
                  {/* user and views */}
                  <div className="flex justify-between mb-2">
                    <Link
                      to={`/profile/${
                        userGlobal?._id === blog.userId._id ? "me" : blog.userId._id
                      }`}
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
          ))
        ) : (
          <p className="text-center text-slate-500">"Chưa có bài viết nào trong series này"</p>
        )}
      </div>
    </div>
  );
}

export default SeriesDetailPage;
