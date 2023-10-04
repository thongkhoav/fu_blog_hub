import { useState } from "react";
import { Link } from "react-router-dom";
import { PATH, navigateUserTo } from "~/utils/constants";
import { BiUpArrow, BiDownArrow, BiBookmark, BiCommentDetail } from "react-icons/bi";
import { MdOutlineReportProblem } from "react-icons/md";
import { Dropdown, Modal, Button, Tooltip } from "antd";

import type { MenuProps } from "antd";
import { Category, Tag } from "~/utils/models/blog.model";

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
function OptionSideHome({ isBlogDetail = false }) {
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

export default OptionSideHome;
