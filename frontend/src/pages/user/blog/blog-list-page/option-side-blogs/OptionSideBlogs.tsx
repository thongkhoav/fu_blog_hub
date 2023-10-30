import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Category, Tag } from "~/utils/models/blog.model";
import toastOption from "~/utils/constants/toastOption";
import axios from "~/config/axios";

// cố định khi scroll
function OptionSideBlogs({ filters, setFilters }: { filters: any; setFilters: any }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filterTag, setFilterTag] = useState<string[]>([]);

  useEffect(() => {
    //fetch category list and tag list
    (async function () {
      if (filters.category.length > 0) setFilterCategory(filters.category);
      if (filters.tag.length > 0) setFilterTag(filters.tag);
      try {
        const { data: tagData } = await axios.get("/api/v1/tags");
        const { data: cateData } = await axios.get("/api/v1/categories");
        setTags(tagData.data);
        setCategories(cateData.data);
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
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
    console.log(filterTag);
  };

  const hanleFilter = async () => {
    console.log(filterCategory, filterTag);

    setFilters({ category: filterCategory, tag: filterTag });
  };

  const resetFilter = () => {
    setFilterCategory([]);
    setFilterTag([]);
    setFilters({ category: [], tag: [] });
  };

  return (
    <div className="flex flex-col m-5 mr-0 sticky top-20">
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
              className={`cursor-pointer border-2 border-solid text-sm text-inherit px-4 py-2 mb-3 mr-3 rounded-sm bg-[#f2f2f2] ${
                filterTag.includes(tag._id) ? "border-cyan-600" : "border-transparent"
              }`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      <button
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded w-[80%] self-center"
        onClick={hanleFilter}
      >
        Lọc bài viết
      </button>
      <button
        className="bg-orange-500 mt-4 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-[80%] self-center"
        onClick={resetFilter}
      >
        Reset filter
      </button>
    </div>
  );
}

export default OptionSideBlogs;
