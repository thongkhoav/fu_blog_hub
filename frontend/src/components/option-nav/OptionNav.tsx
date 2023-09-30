import { useState } from "react";
import { Link } from "react-router-dom";
import { PATH, navigateUserTo } from "~/utils/constants";
import { BiUpArrow, BiDownArrow, BiBookmark, BiCommentDetail } from "react-icons/bi";
import { MdOutlineReportProblem } from "react-icons/md";
import { Dropdown, Modal, Button, Tooltip } from "antd";

import type { MenuProps } from "antd";

interface Category {
  _id: string;
  name: string;
}

interface Tag {
  _id: string;
  name: string;
}

const categoriess: Category[] = [
  {
    _id: "1",
    name: "Kinh tế"
  },
  {
    _id: "2",
    name: "Công nghệ thông tin"
  },
  {
    _id: "3",
    name: "Ngôn ngữ"
  },
  {
    _id: "4",
    name: "Thiết kế"
  },
  {
    _id: "5",
    name: "Trí tuệ nhân tạo"
  },
  {
    _id: "6",
    name: "Tiếng anh dự bị"
  },
  {
    _id: "7",
    name: "Thực tập"
  },
  {
    _id: "8",
    name: "Khách sạn"
  },
  {
    _id: "9",
    name: "Soft skills"
  }
];

const tagsData: Tag[] = [
  {
    _id: "1",
    name: ".Net"
  },
  {
    _id: "2",
    name: "Tiếng Nhật"
  },
  {
    _id: "3",
    name: "Kinh doanh quốc tế"
  },
  {
    _id: "4",
    name: "LUK"
  },
  {
    _id: "5",
    name: "Networking"
  },
  {
    _id: "6",
    name: "Thuyết trình"
  }
];

// cố định khi scroll
function OptionNav({ isBlogDetail = false }) {
  const [categories, setCategories] = useState<Category[]>(categoriess);
  const [tags, setTags] = useState<Tag[]>(tagsData);
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
      {/* (blog detail) chứa avt author ở giữa, 2 nút trên dưới để trừ +- điểm, trái bookmark, phải go to comment */}
      {isBlogDetail && (
        <>
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
              <Link to={navigateUserTo(PATH.PROFILE, "213123")} className="flex gap-2 items-center">
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
        </>
      )}

      {/* category contains blog category - chip list */}
      <div>
        <h1 className="text-lg uppercase font-medium mb-2">Chủ đề</h1>
        <div className="flex flex-wrap">
          {categories.map(cate => (
            <Link
              to={`${PATH.BLOG}?cate=${cate.name}`}
              key={cate._id}
              className="text-sm text-inherit px-4 py-2 mb-2 border border-[#c4c4c4] border-solid rounded-3xl mr-2 hover:bg-[#f1f1f1]"
            >
              {cate.name}
            </Link>
          ))}
        </div>
      </div>

      <hr className="w-1px bg-slate-300 my-5" />

      {/* (blog detail) tag list - click thì search */}
      <div>
        <h1 className="text-lg uppercase font-medium my-3">Tag</h1>
        <div className="flex flex-wrap ">
          {tags.map(tag => (
            <Link
              to={`${PATH.BLOG}?tag=${tag.name}`}
              key={tag._id}
              className="text-sm text-inherit px-4 py-2 mb-3 mr-3 rounded-sm bg-[#f2f2f2]"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OptionNav;
