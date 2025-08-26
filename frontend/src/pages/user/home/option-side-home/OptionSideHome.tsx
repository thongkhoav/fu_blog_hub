import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATH, userPath } from "~/utils/constants";

import type { MenuProps } from "antd";
import { Category, Tag } from "~/utils/models/blog.model";
import { toast } from "react-toastify";
import axios from "~/config/axios";
import toastOption from "~/utils/constants/toastOption";

// cố định khi scroll
function OptionSideHome({ isBlogDetail = false }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [point, setPoint] = useState<number>(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: cates } = await axios.get("/api/v1/categories");
        const { data: tags } = await axios.get("/api/v1/tags");
        setTags(tags.data);
        setCategories(cates.data);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    })();
  }, []);
  return (
    <div className=" flex-1 m-5 mr-0">
      {/* category contains blog category - chip list */}
      <div>
        <h1 className="text-lg uppercase font-medium mb-2">Category</h1>
        <div className="flex flex-wrap">
          {categories.map(cate => (
            <Link
              to={`${PATH.BLOG}`}
              key={cate._id}
              state={{ category: [cate._id] }}
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
              to={`${PATH.BLOG}`}
              key={tag._id}
              state={{ tag: [tag._id] }}
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
