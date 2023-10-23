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

// cố định khi scroll
function BlogInfoSide({ blogDetail }: { blogDetail: BlogDetail }) {
  const [point, setPoint] = useState<number>(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookmarkList, setBookmarkList } = useStoreContext();
  const { userGlobal } = useAuth();
  const axiosPrivate = useAxiosPrivate();

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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className=" flex-1 m-5 mr-0">
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Report blog</p>
      </Modal>
      <div className="flex px-4 gap-4 relative">
        <Tooltip title="Bookmark">
          {userGlobal && (
            <span className="absolute -right-1 top-0 text-xl cursor-pointer">
              {bookmarkList.includes(blogDetail._id) ? (
                <BsBookmarkFill onClick={() => toggleBookmark(blogDetail._id, true)} />
              ) : (
                <BiBookmark onClick={() => toggleBookmark(blogDetail._id, false)} />
              )}
            </span>
          )}
        </Tooltip>
        <div className="flex flex-col justify-between items-center gap-2 min-w-[35px]">
          <BiUpArrow
            className="cursor-pointer text-xl select-none"
            onClick={() => setPoint(point => point + 1)}
          />
          <Tooltip title="Blog point" placement="right">
            <span className="text-3xl font-normal tracking-wider ">{point}</span>
          </Tooltip>
          <BiDownArrow
            className="cursor-pointer text-xl select-none"
            onClick={() => setPoint(point => point - 1)}
          />
        </div>
        <div className="flex flex-col justify-center gap-5">
          <Link
            to={userPath(PATH.PROFILE, blogDetail.userId._id)}
            className="flex gap-2 items-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1995/1995562.png"
              alt="avt author"
              className="w-12 h-12 object-cover rounded-full border-2 border-solid border-orange-500"
            />
            <span>{blogDetail.userId.fullName}</span>
          </Link>
          <div className="flex gap-3">
            <Tooltip title="Go to comments">
              <BiCommentDetail className="text-2xl cursor-pointer" />
            </Tooltip>
            <Dropdown menu={{ items: reportItems }}>
              <MdOutlineReportProblem className="text-2xl cursor-pointer" />
            </Dropdown>
          </div>
        </div>
      </div>
      <hr className="w-1px bg-slate-300 my-5" />
    </div>
  );
}

export default BlogInfoSide;
