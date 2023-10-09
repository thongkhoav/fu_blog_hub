import { useState } from "react";
import { Link } from "react-router-dom";
import { PATH, userPath } from "~/utils/constants";
import { BiUpArrow, BiDownArrow, BiBookmark, BiCommentDetail } from "react-icons/bi";
import { MdOutlineReportProblem } from "react-icons/md";
import { Dropdown, Modal, Button, Tooltip } from "antd";

import type { MenuProps } from "antd";
import { Category, Tag } from "~/utils/models/blog.model";

// cố định khi scroll
function BlogInfoSide({ isBlogDetail = false }) {
  const [point, setPoint] = useState<number>(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        <p>report</p>
      </Modal>
      <div className="flex px-4 gap-7 relative">
        <Tooltip title="Bookmark">
          <BiBookmark className="absolute right-3 top-3 text-2xl cursor-pointer" />
        </Tooltip>
        <div className="flex flex-col justify-between items-center gap-2 min-w-[38px]">
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
          <Link to={userPath(PATH.PROFILE, "213123")} className="flex gap-2 items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1995/1995562.png"
              alt="avt author"
              className="w-12 h-12 object-cover rounded-full border-2 border-solid border-orange-500"
            />
            <span>Shakespear</span>
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
