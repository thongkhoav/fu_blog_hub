import { useEffect, useState } from "react";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { toast } from "react-toastify";
import { Category, Tag } from "~/utils/models/blog.model";
import toastOption from "~/utils/constants/toastOption";

const categoriess: Category[] = [
  {
    _id: "6521646128d9f680f0e0f4eb",
    name: "Kinh tế"
  },
  {
    _id: "65217b0d3e5240adb158f660",
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
    _id: "652154c7f34c483654663245",
    name: ".Net"
  },
  {
    _id: "652154d6f34c48365466324e",
    name: "Tiếng Nhật"
  },
  {
    _id: "65214fd3e5d11209b2a22967",
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
function OptionSideBlogs({ filters, setFilters }: { filters: any; setFilters: any }) {
  const [categories, setCategories] = useState<Category[]>(categoriess);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>(tagsData);
  const [filterTag, setFilterTag] = useState<string[]>([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    //fetch category list and tag list
  }, []);

  const toggleCategoryFilter = (cateId: string) => {
    if (filterCategory.includes(cateId)) {
      setFilterCategory(filterCategory.filter(cate => cate !== cateId));
    } else {
      setFilterCategory([...filterCategory, cateId]);
    }
  };

  const toggleTagFilter = (tagId: string) => {
    if (filterTag.includes(tagId)) {
      setFilterTag(filterTag.filter(tag => tag !== tagId));
    } else {
      setFilterTag([...filterTag, tagId]);
    }
  };

  const hanleFilter = async () => {
    // setFilters({ category: filterCategory, tag: filterTag });
    var res =  await axiosPrivate.post(`/api/v1/blogs/filterBlogList`,{ category: filterCategory, tag: filterTag })
    if(res.data.status === "success") {
      setFilters(res.data.data);
    } else {
      toast.error(res.data.msg, toastOption);
      setFilters([]);
    }
  };

  return (
    <div className="flex flex-col m-5 mr-0 sticky top-20">
      {/* category contains blog category - chip list */}
      <div>
        <h1 className="text-lg uppercase font-medium mb-2">Chủ đề</h1>
        <div className="flex flex-wrap">
          {categories.map(cate => (
            <span
              key={cate._id}
              onClick={() => toggleCategoryFilter(cate._id)}
              className={`cursor-pointer text-sm text-inherit px-4 py-2 mb-2 border border-[#c4c4c4] border-solid rounded-3xl mr-2 hover:bg-[#f1f1f1] ${
                filterCategory.includes(cate._id) && "bg-[#f1f1f1]"
              }`}
            >
              {cate.name}
            </span>
          ))}
        </div>
      </div>

      <hr className="w-1px bg-slate-300 my-5" />
      <div>
        <h1 className="text-lg uppercase font-medium my-3">Tag</h1>
        <div className="flex flex-wrap ">
          {tags.map(tag => (
            <span
              key={tag._id}
              onClick={() => toggleTagFilter(tag._id)}
              className={`cursor-pointer border border-${
                filterTag.includes(tag._id) ? "[#c4c4c4]" : "transparent"
              } border-solid border-2 text-sm text-inherit px-4 py-2 mb-3 mr-3 rounded-sm bg-[#f2f2f2]`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      <button
        className="bg-cyan-600 mt-4 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded w-[80%] self-center"
        onClick={hanleFilter}
      >
        Lọc bài viết
      </button>
      <button className="bg-orange-500 mt-4 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-[80%] self-center">
        Reset filter
      </button>
    </div>
  );
}

export default OptionSideBlogs;
