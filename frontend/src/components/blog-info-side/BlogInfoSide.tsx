import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { PATH, userPath } from "~/utils/constants";
import { BiUpArrow, BiDownArrow, BiBookmark, BiCommentDetail } from "react-icons/bi";
import { MdOutlineReportProblem } from "react-icons/md";
import { Dropdown, Modal, Tooltip } from "antd";

import type { MenuProps } from "antd";
import { BlogDetail } from "~/utils/models/blog.model";
import { BsBookmarkFill } from "react-icons/bs";
import { useStoreContext } from "~/contexts/StoreProvider";
import { useAuth } from "~/utils/helpers";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import TextArea from "antd/es/input/TextArea";
import { reportBlogApiPath } from "~/apis/blog.api";

// cố định khi scroll
function BlogInfoSide({ blogDetail }: { blogDetail: BlogDetail }) {
  const [point, setPoint] = useState<number>(blogDetail.totalPoint * 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookmarkList, setBookmarkList } = useStoreContext();
  const { userGlobal } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [reportContent, setReportContent] = useState("");

  const toggleBookmark = async (blogId: string, toRemove: boolean) => {
    if (!userGlobal) return;
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const reportItems: MenuProps["items"] = [
    {
      key: "1",
      label: <span onClick={showModal}>Report blog</span>
    },
    {
      key: "2",
      label: <span>Report user</span>
    }
  ];

  const handleReportBlog = async () => {
    if (!userGlobal) {
      toast.error("Bạn cần đăng nhập để report", toastOption);
      return;
    }

    if (!reportContent) return toast.error("Vui lòng nhập lý do báo cáo bài viết", toastOption);

    try {
      axiosPrivate
        .post(reportBlogApiPath, {
          content: reportContent,
          objectId: blogDetail._id,
          type: "blog"
        })
        .then(res => {
          setIsModalOpen(false);
          toast.success("Report bài viết thành công", toastOption);
        })
        .catch(err => {
          toast.error(err.response.data.message, toastOption);
        });
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onVoteBlog = async (blogId: string, vote: string) => {
    await axiosPrivate
      .post(`/api/v1/blogs/vote`, { vote, blogId })
      .then(res => {
        toast.success("Đã vote", toastOption);
        if (vote === "up") {
          setPoint(point => point + 1);
        }
        if (vote === "down") {
          setPoint(point => point - 1);
        }
      })
      .catch(err => {
        const response = err.response;
        toast.error(response.data.message, toastOption);
      });
  };

  return (
    <div className=" flex-1 m-5 mr-0">
      <Modal
        title="Báo cáo bài viết"
        open={isModalOpen}
        onOk={handleReportBlog}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !reportContent, className: "bg-blue-500" }}
      >
        <TextArea
          rows={4}
          placeholder="Lý do báo cáo"
          maxLength={200}
          onChange={e => setReportContent(e.target.value)}
        />
      </Modal>
      <div className="flex px-4 gap-4 relative flex-col justify-start">
        <div className="flex flex-col justify-center gap-1 items-center">
          <Link
            to={userPath(PATH.PROFILE, blogDetail.userId._id)}
            className="flex gap-1 items-center flex-col"
          >
            <img
              src={blogDetail.userId.avatar || "/images/default-avatar.png"}
              alt="avt author"
              className="w-12 h-12 object-cover rounded-full border-2 border-solid border-orange-500"
            />
            <span className="text-xs">{blogDetail.userId.fullName}</span>
          </Link>
          <div className="flex gap-3">
            <Tooltip title="Go to comments">
              <BiCommentDetail className="text-xl cursor-pointer" />
            </Tooltip>
            <Dropdown menu={{ items: reportItems }}>
              <MdOutlineReportProblem className="text-xl cursor-pointer" />
            </Dropdown>

            <Tooltip title="Bookmark">
              {userGlobal && (
                <span className="text-xl cursor-pointer">
                  {bookmarkList.includes(blogDetail._id) ? (
                    <BsBookmarkFill onClick={() => toggleBookmark(blogDetail._id, true)} />
                  ) : (
                    <BiBookmark onClick={() => toggleBookmark(blogDetail._id, false)} />
                  )}
                </span>
              )}
            </Tooltip>
          </div>
        </div>
        <hr className="bg-slate-300 my-2" />
        <div className="flex flex-col justify-between items-center gap-2 min-w-[35px]">
          <BiUpArrow
            className="cursor-pointer text-xl select-none"
            onClick={() => onVoteBlog(blogDetail._id, "up")}
          />
          <Tooltip title="Blog point" placement="right">
            <span className="text-3xl font-normal tracking-wider ">{point}</span>
          </Tooltip>
          <BiDownArrow
            className="cursor-pointer text-xl select-none"
            onClick={() => onVoteBlog(blogDetail._id, "down")}
          />
        </div>
      </div>
    </div>
  );
}

export default BlogInfoSide;
