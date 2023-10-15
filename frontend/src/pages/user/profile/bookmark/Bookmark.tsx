import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { useStoreContext } from "~/contexts/StoreProvider";
import { PATH } from "~/utils/constants";
import toastOption from "~/utils/constants/toastOption";
import { BlogItem } from "~/utils/models/blog.model";
import { BookmarkBlogItem } from "~/utils/models/bookmark.model";

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkBlogItem[]>([]);
  const { setBookmarkList } = useStoreContext();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    (async function () {
      try {
        const { data } = await axiosPrivate.get("/api/v1/bookmarks");
        setBookmarks(data.data);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    })();
  }, []);

  const removeBookmark = async (blogId: string) => {
    try {
      await axiosPrivate.put(`/api/v1/bookmarks/${blogId}/remove`);
      setBookmarks(prev => prev.filter(bookmark => bookmark.blogId._id !== blogId));
      setBookmarkList(prev => prev.filter(id => id !== blogId));
      toast.success("Đã xóa khỏi danh sách bookmark", toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-4 px-20">
      {bookmarks.map(blog => (
        <div key={blog.blogId._id} className="flex gap-5 flex-[1] box-border border p-3 rounded-md">
          <Link
            to={`${PATH.BLOG}/${blog.blogId._id}`}
            className="w-1/4 rounded-md overflow-hidden max-h-fit"
          >
            <img
              src={blog.blogId.thumbnail}
              alt="thumbnail"
              className="object-cover h-full w-full"
            />
          </Link>
          <div className="flex flex-col justify-between w-3/4">
            <div>
              <div className="flex justify-between">
                {/* category, point and bookmark */}
                <section className="flex items-center gap-2">
                  <span className="text-sm uppercase">{blog.blogId.blogCateId.name}</span>
                </section>
                <span
                  className="text-2xl cursor-pointer text-red-600"
                  onClick={() => removeBookmark(blog.blogId._id)}
                >
                  <RxCross2 />
                </span>
              </div>
              <Link
                to={`${PATH.BLOG}/${blog.blogId._id}`}
                className=" text-base font-bold line-clamp-2"
              >
                {blog.blogId.title}
              </Link>
              <p className="text-sm line-clamp-3">{blog.blogId.description}</p>
            </div>
            <div>
              {/* user and views */}
              <div className="flex justify-between mb-2">
                <Link to={`/profile/${blog.blogId.userId._id}`} className="flex items-center gap-3">
                  <img
                    src={blog.blogId.userId.avatar}
                    alt="avatar author"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-bold">{blog.blogId.userId.fullName}</span>
                </Link>
                <span className="flex items-center text-xs">
                  <AiOutlineEye className="text-xl mr-1" />
                  {blog.blogId.numView}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bookmark;
